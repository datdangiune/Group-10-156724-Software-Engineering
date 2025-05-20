const { Household, UserHousehold, User, FeeService,  FeeHousehold } = require('../models/index');
const { Op } = require('sequelize');
const getHouseholdUsersInfo = async (req, res) => {
  try { 
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const totalHouseholds = await UserHousehold.count({
      where: { isOwner: true },
    });


    // Lấy households phân trang
    const households = await Household.findAll({
      attributes: ['id', 'isActive'],
      include: [
        {
          model: UserHousehold,
          attributes: ['isOwner'],
          where: { isOwner: true },
          include: [
            {
              model: User,
              attributes: ['fullname', 'phoneNumber', 'email'],
            }
          ]
        }
      ],
      offset,
      limit
    });

    // Đếm số người trong từng household
    const userCounts = await UserHousehold.findAll({
      attributes: [
        'householdId',
        [require('sequelize').fn('COUNT', require('sequelize').col('userId')), 'memberCount']
      ],
      group: ['householdId']
    });

    // Map householdId -> memberCount
    const countMap = {};
    userCounts.forEach(item => {
      countMap[item.householdId] = item.get('memberCount');
    });
    const result = households.map(hh => {
      const userHousehold = hh.UserHouseholds && hh.UserHouseholds[0];
      const user = userHousehold && userHousehold.User;
      return {
        householdId: hh.id,
        fullname: user ? user.fullname : null,
        phoneNumber: user ? user.phoneNumber : null,
        email: user ? user.email : null,
        memberCount: countMap[hh.id] ? parseInt(countMap[hh.id]) : 0
      };
    });

    const totalPages = Math.ceil(totalHouseholds / limit);

    res.status(200).json({
      success: true,
      message: "Get household users info successfully",
      totalHouseholds,
      page,
      limit,
      totalPages,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const createHousehold = async (req, res) => {
  try {
    const householdsData = req.body; // kỳ vọng nhận mảng [{apartmentNumber, area}, ...]

    if (!Array.isArray(householdsData) || householdsData.length === 0) {
      return res.status(400).json({ message: 'Input must be a non-empty array' });
    }

    // Kiểm tra tất cả phần tử phải có apartmentNumber và area
    for (const item of householdsData) {
      if (!item.apartmentNumber || !item.area || !item.id) {
        return res.status(400).json({ message: 'Each household must have apartmentNumber and area' });
      }
    }

    // Tạo nhiều household cùng lúc
    const households = await Household.bulkCreate(householdsData);

    res.status(201).json({
      success: true,
      message: 'Households created successfully',
      data: households,
      totalCreated: households.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const addUserToHousehold = async (req, res) => {
  try {
    const { userId, householdId, roleInFamily, isOwner, joinedAt } = req.body;
    if (!userId || !householdId || !roleInFamily) {
      return res.status(400).json({ message: 'Missing required fields: userId, householdId, roleInFamily' });
    }

    // Kiểm tra user và household tồn tại
    const user = await User.findByPk(userId);
    const household = await Household.findByPk(householdId);
    if (!user || !household) {
      return res.status(404).json({ message: 'User or Household not found' });
    }

    // Thêm user vào household
    const userHousehold = await UserHousehold.create({
      userId,
      householdId,
      roleInFamily,
      isOwner: isOwner ?? false,
      joinedAt: joinedAt || new Date()
    });
    await Household.update({ isActive: true }, { where: { id: householdId } });
    res.status(201).json({
      success: true,
      message: 'User added to household successfully',
      data: userHousehold
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createUsers = async (req, res) => {
  try {
    let usersData = req.body;
    if (!usersData || (Array.isArray(usersData) && usersData.length === 0)) {
      return res.status(400).json({ message: 'Input must be a non-empty object or array' });
    }

    // Nếu là 1 user object thì chuyển thành mảng
    if (!Array.isArray(usersData)) {
      usersData = [usersData];
    }

    // Kiểm tra các trường bắt buộc
    for (const user of usersData) {
      if (!user.email || !user.fullname || !user.phoneNumber || !user.gender || !user.cccd ||!user.dateOfBirth) {
        return res.status(400).json({ message: 'Each user must have email, fullname, phoneNumber, gender, cccd' });
      }
    }

    // Tạo users
    const users = await User.bulkCreate(usersData, { validate: true });

    res.status(201).json({
      success: true,
      message: 'Users created successfully',
      data: users,
      totalCreated: users.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllUsersInHousehold = async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const { count, rows } = await UserHousehold.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['fullname', 'dateOfBirth', 'gender', 'id', 'cccd']
        }
      ],
      attributes: ['roleInFamily', 'householdId'],
      offset,
      limit
    });

    const totalPages = Math.ceil(count / limit);

    const result = rows.map(uh => ({
      userId: uh.User ? uh.User.id : null,
      fullname: uh.User ? uh.User.fullname : null,
      dateOfBirth: uh.User ? uh.User.dateOfBirth : null,
      gender: uh.User ? uh.User.gender : null,
      roleInFamily: uh.roleInFamily,
      householdId: uh.householdId,
      cccd: uh.User ? uh.User.cccd : null
    }));

    res.status(200).json({
      success: true,
      message: "Get all users in households successfully",
      total: count,
      page,
      limit,
      totalPages,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const addFeeService = async (req, res) => {
  try {
    let feeServices = req.body;
    if (!feeServices || (Array.isArray(feeServices) && feeServices.length === 0)) {
      return res.status(400).json({ message: 'Input must be a non-empty object or array' });
    }
    if (!Array.isArray(feeServices)) {
      feeServices = [feeServices];
    }
    for (const fee of feeServices) {
      if (!fee.serviceName || fee.servicePrice == null || !fee.unit || !fee.type) {
        return res.status(400).json({ message: 'Each feeService must have serviceName, servicePrice, unit' });
      }
    }
    const created = await FeeService.bulkCreate(feeServices, { validate: true });
    res.status(201).json({
      success: true,
      message: 'FeeService(s) created successfully',
      data: created,
      totalCreated: created.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const getFeeService = async(req, res) => {
  try {
    const feeService = await FeeService.findAll();
    if(!feeService){
      return res.status(404).json({
        success: false,
        message: 'FeeService not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get FeeService successfully',
      data: feeService
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const addHouseholdAndUser = async (req, res) => {
  try {
    const { householdId, owner, members } = req.body;
    if (!householdId || !owner || !owner.email || !owner.fullname || !owner.phoneNumber || !owner.gender || !owner.dateOfBirth || !owner.cccd) {
      return res.status(400).json({ success: false, message: 'Missing required fields for household or owner' });
    }

    // Kiểm tra household tồn tại và isActive
    const household = await Household.findOne({ where: { id: householdId, isActive: false} });
    if (!household) {
      return res.status(404).json({ success: false, message: 'Household not found or hired' });
    }

    // Tạo user chủ hộ
    const ownerUser = await User.create({
      email: owner.email,
      fullname: owner.fullname,
      phoneNumber: owner.phoneNumber,
      gender: owner.gender,
      dateOfBirth: owner.dateOfBirth,
      cccd: owner.cccd
    });

    // Thêm chủ hộ vào UserHousehold
    await UserHousehold.create({
      userId: ownerUser.id,
      householdId,
      roleInFamily: 'Chủ hộ',
      isOwner: true,
      joinedAt: new Date()
    });
    await Household.update({ isActive: true }, { where: { id: householdId } });
    // Thêm các thành viên khác (nếu có)
    let memberResults = [];
    if (Array.isArray(members) && members.length > 0) {
      for (const member of members) {
        if (!member.email || !member.fullname || !member.phoneNumber || !member.gender || !member.dateOfBirth || !member.cccd || !member.roleInFamily) {
          return res.status(400).json({ success: false, message: 'Each member must have email, fullname, phoneNumber, gender, dateOfBirth, cccd, roleInFamily' });
        }
        // Tạo user thành viên
        const user = await User.create({
          email: member.email,
          fullname: member.fullname,
          phoneNumber: member.phoneNumber,
          gender: member.gender,
          dateOfBirth: member.dateOfBirth,
          cccd: member.cccd
        });
        // Thêm vào UserHousehold
        const userHousehold = await UserHousehold.create({
          userId: user.id,
          householdId,
          roleInFamily: member.roleInFamily,
          isOwner: false,
          joinedAt: new Date()
        });
        memberResults.push({ user, userHousehold });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Household owner and members added successfully',
      owner: ownerUser,
      members: memberResults.map(m => m.user)
    });
  } catch (error) {
      console.error(error); // <-- in rõ lỗi
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ success: false, message: 'Email hoặc CCCD đã tồn tại' });
      }
      return res.status(500).json({ success: false, error: error.message });
  } 
};
const getHouseholdUnactive = async (req, res) => {
  try {
    const response = await Household.findAll({
      attributes: ['id', 'area'],
      where: {
        isActive: false
      }
    });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'No unactive household found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get unactive household successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const getHouseholdActive = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query param: month',
    });
  }
  try {
    const usedHouseholds = await FeeHousehold.findAll({
      attributes: ['householdId'],
      where: { month },
      group: ['householdId'],
      raw: true,
    });
    const usedIds = usedHouseholds.map(item => item.householdId);
    const response = await Household.findAll({
      attributes: ['id', 'area'],
      where: {
        isActive: true,
        id: {
          [Op.notIn]: usedIds.length ? usedIds : [''] // nếu rỗng thì phải truyền array dummy để không lỗi
        }
      }
    });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'No active household found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get active household successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const addFeeUtilityHouseholdPerMonth = async (req, res) => { //Tạm thời fix cứng do UI
  const {
    householdId,
    // feeServiceWaterId,
    // feeServiceElectricId,
    // feeServiceInternetId,
    water,
    electricity,
    internet
  } = req.body;
  const feeServiceWaterId = "22613ce3-314c-45fd-82bb-e9c29a9fde05";
  const feeServiceElectricId  = "dfd15bda-e6f9-414a-a06d-54b6f591c328";
  const feeServiceInternetId =  "0609e56a-5eaa-46f6-8ac5-ae54249924c8"

  if (
    !householdId ||
    // !feeServiceWaterId ||
    // !feeServiceElectricId ||
    // !feeServiceInternetId ||
    water == null ||
    electricity == null ||
    internet == null 
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Missing required fields: householdId, feeServiceWaterId, feeServiceElectricId, feeServiceInternetId, water, electricity, internet',
    });
  }

  try {
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${yyyy}-${mm}`;
    const isHousehold = await Household.findOne({
      where: { id: householdId, isActive: true },
    });
    if (!isHousehold) {
      return res.status(404).json({
        success: false,
        message: 'Household not found',
      });
    }
    const existingRecords = await FeeHousehold.findAll({
      where: {
        householdId,
        month: currentMonth,
        feeServiceId: {
          [Op.in]: [feeServiceWaterId, feeServiceElectricId, feeServiceInternetId],
        },
      },
    });

    if (existingRecords.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Utility fee records already exist for this household this month',
      });
    }
    const [feeServiceWater, feeServiceElectric, feeServiceInternet] = await Promise.all([
      FeeService.findOne({ where: { id: feeServiceWaterId } }),
      FeeService.findOne({ where: { id: feeServiceElectricId } }),
      FeeService.findOne({ where: { id: feeServiceInternetId } }),
    ]);

    if (!feeServiceWater || !feeServiceElectric || !feeServiceInternet) {
      return res.status(404).json({
        success: false,
        message: 'One or more fee services not found',
      });
    }

    const createdRecords = [];

    const waterFee = await FeeHousehold.create({
      householdId,
      feeServiceId: feeServiceWaterId,
      water,
      amount: water * feeServiceWater.servicePrice,
      month: currentMonth,
    });
    createdRecords.push(waterFee);

    const electricFee = await FeeHousehold.create({
      householdId,
      feeServiceId: feeServiceElectricId,
      electricity,
      amount: electricity * feeServiceElectric.servicePrice,
      month: currentMonth,
    });
    createdRecords.push(electricFee);

    if (internet === true) {
      const internetFee = await FeeHousehold.create({
        householdId,
        feeServiceId: feeServiceInternetId,
        internet: true,
        amount: feeServiceInternet.servicePrice,
        month: currentMonth,
      });
      createdRecords.push(internetFee);
    }

    return res.status(201).json({
      success: true,
      message: 'Utility fees created successfully',
      data: createdRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
const getFeeUtilityHouseholdPerMonth = async (req, res) => {
  const {month} = req.query;
  if (!month) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: month',
    });
  }
  try {
    const records = await FeeHousehold.findAll({
      where : {month},
      raw: true,
    });
    const grouped = records.reduce((acc, record) => {
      if (!acc[record.householdId]) {
        acc[record.householdId] = {
          householdId: record.householdId,
          water: 0,
          electricity: 0,
          internet: false,
          totalPrice: 0,
          statusInternet: null,
        };
      }
      if (record.water) acc[record.householdId].water += record.water;
      if (record.electricity) acc[record.householdId].electricity += record.electricity;
      if (record.internet) {
        acc[record.householdId].internet = true;
        acc[record.householdId].statusInternet = record.status;
      }
      acc[record.householdId].totalPrice += record.amount;
      return acc;
    }, {});
    const result = Object.values(grouped);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
  }
}
const getHouseholdInuse= async (req, res) => {
  try {
    const response = await Household.findAll({
      attributes: ['id', 'area'],
      where: {
        isActive: true
      }
    });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'No household found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get household successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const autoAddManagementAndServiceFee = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Missing required query param: month",
      });
    }
    const isValidFormat = /^\d{4}-\d{2}$/.test(month);
    if (!isValidFormat) {
      return res.status(400).json({
        success: false,
        message: "Invalid month format. Expected format is YYYY-MM",
      });
    }
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    if (month > currentMonth) {
      return res.status(400).json({
        success: false,
        message: "Cannot add fees for future months",
      });
    }
    // Lấy tất cả household đang hoạt động
    const households = await Household.findAll({
      where: { isActive: true },
      attributes: ['id', 'area'],
      raw: true,
    });

    // Lấy thông tin phí quản lý và phí dịch vụ
    const managementFeeId = "0c740662-c6e9-473c-b68d-5d25f935a208";
    const serviceFeeId = "1fb63de8-fb8c-496d-8721-ffbe614989ca";
    const [managementFee, serviceFee] = await Promise.all([
      FeeService.findByPk(managementFeeId),
      FeeService.findByPk(serviceFeeId),
    ]);
    if (!managementFee || !serviceFee) {
      return res.status(404).json({
        success: false,
        message: "Management or Service FeeService not found",
      });
    }

    // Lấy tất cả householdId đã có record trong tháng này
    const existed = await FeeHousehold.findAll({
      where: {
        month,
        feeServiceId: { [Op.in]: [managementFeeId, serviceFeeId] },
      },
      attributes: ['householdId', 'feeServiceId'],
      raw: true,
    });
    const existedSet = new Set(existed.map(e => `${e.householdId}_${e.feeServiceId}`));

    // Tạo danh sách cần insert cho các household chưa có phí trong tháng này
    const recordsToCreate = [];
    for (const hh of households) {
      // Phí quản lý
      if (!existedSet.has(`${hh.id}_${managementFeeId}`)) {
        recordsToCreate.push({
          householdId: hh.id,
          feeServiceId: managementFeeId,
          month,
          amount: managementFee.servicePrice * hh.area,
        });
      }
      // Phí dịch vụ
      if (!existedSet.has(`${hh.id}_${serviceFeeId}`)) {
        recordsToCreate.push({
          householdId: hh.id,
          feeServiceId: serviceFeeId,
          month,
          amount: serviceFee.servicePrice * hh.area,
        });
      }
    }

    // Nếu không có household nào mới, trả về thông báo
    if (recordsToCreate.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new management/service fee records to add for this month. If you have added new households, please call this API again to add fees for them.",
        totalCreated: 0,
      });
    }

    const created = await FeeHousehold.bulkCreate(recordsToCreate);

    return res.status(201).json({
      success: true,
      message: "Added management and service fees for active households. If you add more households later, call this API again to add fees for them.",
      totalCreated: created.length,
      data: created,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllManagementAndServiceFees = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: month',
    });
  }
  try {
    const managementFeeId = "0c740662-c6e9-473c-b68d-5d25f935a208";
    const serviceFeeId = "1fb63de8-fb8c-496d-8721-ffbe614989ca";
    const records = await FeeHousehold.findAll({
      where: {
        feeServiceId: {
          [Op.in]: [managementFeeId, serviceFeeId]
        },
        month: month
      },
      include: [
        {
          model: FeeService,
          attributes: ['serviceName', 'servicePrice', 'unit'],
        }
      ],
    });
    res.status(200).json({
      success: true,
      message: "Fetched all management and service fee records",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
module.exports = {
  getHouseholdUsersInfo,
  createHousehold,
  addUserToHousehold,
  createUsers,
  getAllUsersInHousehold,
  addFeeService,
  getFeeService,
  addHouseholdAndUser,
  getHouseholdUnactive,
  addFeeUtilityHouseholdPerMonth,
  getFeeUtilityHouseholdPerMonth,
  getHouseholdActive,
  getHouseholdInuse,
  autoAddManagementAndServiceFee,
  getAllManagementAndServiceFees
};
