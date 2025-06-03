const { Household, UserHousehold, User, FeeService,  FeeHousehold, Contribution, ContributionPayment, Vehicle} = require('../models/index');
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
    const { userId, householdId, roleInFamily, isOwner, joinedAt, temporaryResidence, permanentResidence} = req.body;
    if (!userId || !householdId || !roleInFamily ||!temporaryResidence || !permanentResidence) {
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
      temporaryResidence,
      permanentResidence,
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
    if (!householdId || !owner || !owner.email || !owner.fullname || !owner.phoneNumber || !owner.gender || !owner.dateOfBirth || !owner.cccd || !owner.permanentResidence || !owner.temporaryResidence) {
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
      cccd: owner.cccd,
      permanentResidence: owner.permanentResidence,
      temporaryResidence: owner.temporaryResidence
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
          cccd: member.cccd,
          permanentResidence: member.permanentResidence,
          temporaryResidence: member.temporaryResidence
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
      },
      order: [['updatedAt', 'DESC']] 
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
  const REQUIRED_SERVICE_IDS = ['cf68679f-a97f-4d57-a505-64ffd165ee35', 'cf4aa82a-3fb1-42a7-a610-cebd57696424']; 
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
      where: { month,
        feeServiceId: {
          [Op.in]: REQUIRED_SERVICE_IDS
        }
      },
      group: ['householdId'],
      raw: true,
    });
    const usedIds = usedHouseholds.map(item => item.householdId);
    console.log('Used household IDs:', usedIds);
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

    water,
    electricity,
    internet
  } = req.body;
  const feeServiceWaterId = "cf4aa82a-3fb1-42a7-a610-cebd57696424";
  const feeServiceElectricId  = "cf68679f-a97f-4d57-a505-64ffd165ee35";
  const feeServiceInternetId =  "a578e224-899b-4646-a1bb-18300ce85cd5"

  if (
    !householdId ||
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
  const internetId = "a578e224-899b-4646-a1bb-18300ce85cd5";
  const electricityId = "cf68679f-a97f-4d57-a505-64ffd165ee35";
  const waterId = "cf4aa82a-3fb1-42a7-a610-cebd57696424";
  try {
    const records = await FeeHousehold.findAll({
      where: {
        month,
        feeServiceId: {
          [Op.in]: [internetId, electricityId, waterId],
        },
      },
      raw: true,
    });
    const grouped = records.reduce((acc, record) => {
      const id = record.householdId;
      if (!acc[id]) {
        acc[id] = {
          householdId: id,
          water: 0,
          electricity: 0,
          internet: false,
          totalPrice: 0,
          statuses: [],
        };
      }
            if (record.feeServiceId === waterId) {
        acc[id].water += record.amount;
        acc[id].totalPrice += record.amount;
        acc[id].statuses.push(record.status);
      }

      if (record.feeServiceId === electricityId) {
        acc[id].electricity += record.amount;
        acc[id].totalPrice += record.amount;
        acc[id].statuses.push(record.status);
      }

      if (record.feeServiceId === internetId) {
        acc[id].internet = true;

        // Nếu internet có sử dụng → tính vào tiền
        if (record.internet === true) {
          acc[id].totalPrice += record.amount;
        }

        acc[id].statuses.push(record.status);
      }
      return acc;
    }, {});
    const result = Object.values(grouped).map((item) => {
      const hasPending = item.statuses.includes('pending');
      return {
        ...item,
        statusPayment: hasPending ? 'pending' : 'paid',
      };
    });

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

    const households = await Household.findAll({
      where: { isActive: true },
      attributes: ['id', 'area'],
      raw: true,
    });

    const managementFeeId = "d27e902c-977f-48dc-8982-fd9d5dd24e9b";
    const serviceFeeId = "a709f2dc-0534-4a41-8300-6b88b6cbc953";
    const motorFeeId = "e3b0486d-394e-46a7-9d26-31ea0cd2431f";
    const carFeeId = "971f6415-25bd-4194-ab98-b9c689fb95ae";

    const [managementFee, serviceFee, motorFee, carFee] = await Promise.all([
      FeeService.findByPk(managementFeeId),
      FeeService.findByPk(serviceFeeId),
      FeeService.findByPk(motorFeeId),
      FeeService.findByPk(carFeeId),
    ]);

    if (!managementFee || !serviceFee || !motorFee || !carFee) {
      return res.status(404).json({
        success: false,
        message: "One or more FeeService not found",
      });
    }

    const existed = await FeeHousehold.findAll({
      where: {
        month,
        feeServiceId: {
          [Op.in]: [managementFeeId, serviceFeeId, motorFeeId, carFeeId],
        },
      },
      attributes: ['householdId', 'feeServiceId'],
      raw: true,
    });

    const existedSet = new Set(existed.map(e => `${e.householdId}_${e.feeServiceId}`));
    const existedVehicleFees = {};
    existed.forEach(e => {
      if (e.feeServiceId === motorFeeId || e.feeServiceId === carFeeId) {
        existedVehicleFees[`${e.householdId}_${e.feeServiceId}`] = true;
      }
    });

    const vehicles = await Vehicle.findAll({
      attributes: ['householdId', 'vehicleType'],
      raw: true,
    });

    const vehicleMap = {};
    vehicles.forEach(v => {
      if (!vehicleMap[v.householdId]) {
        vehicleMap[v.householdId] = { motor: 0, car: 0 };
      }
      if (v.vehicleType === "Xe máy") vehicleMap[v.householdId].motor += 1;
      if (v.vehicleType === "Ô tô") vehicleMap[v.householdId].car += 1;
    });

    const recordsToCreate = [];
    const updatePromises = [];

    for (const hh of households) {
      const { id: householdId, area } = hh;

      // --- Quản lý ---
      if (!existedSet.has(`${householdId}_${managementFeeId}`)) {
        recordsToCreate.push({
          householdId,
          feeServiceId: managementFeeId,
          month,
          amount: managementFee.servicePrice * area,
        });
      }

      // --- Dịch vụ ---
      if (!existedSet.has(`${householdId}_${serviceFeeId}`)) {
        recordsToCreate.push({
          householdId,
          feeServiceId: serviceFeeId,
          month,
          amount: serviceFee.servicePrice * area,
        });
      }

      // --- Gửi xe máy ---
      const motorCount = vehicleMap[householdId]?.motor || 0;
      const motorAmount = motorFee.servicePrice * motorCount;
      const motorKey = `${householdId}_${motorFeeId}`;

      if (motorCount > 0) {
        if (!existedVehicleFees[motorKey]) {
          recordsToCreate.push({
            householdId,
            feeServiceId: motorFeeId,
            month,
            amount: motorAmount,
          });
        } else {
          updatePromises.push(
            FeeHousehold.update(
              { amount: motorAmount },
              {
                where: {
                  householdId,
                  feeServiceId: motorFeeId,
                  month,
                },
              }
            )
          );
        }
      }

      // --- Gửi ô tô ---
      const carCount = vehicleMap[householdId]?.car || 0;
      const carAmount = carFee.servicePrice * carCount;
      const carKey = `${householdId}_${carFeeId}`;

      if (carCount > 0) {
        if (!existedVehicleFees[carKey]) {
          recordsToCreate.push({
            householdId,
            feeServiceId: carFeeId,
            month,
            amount: carAmount,
          });
        } else {
          updatePromises.push(
            FeeHousehold.update(
              { amount: carAmount },
              {
                where: {
                  householdId,
                  feeServiceId: carFeeId,
                  month,
                },
              }
            )
          );
        }
      }
    }

    const created = await FeeHousehold.bulkCreate(recordsToCreate);
    await Promise.all(updatePromises);

    return res.status(201).json({
      success: true,
      message: "Management, service, and vehicle fees have been added or updated successfully.",
      totalCreated: created.length,
      totalUpdated: updatePromises.length,
      created,
    });
  } catch (error) {
    console.error("Error in autoAddManagementAndServiceFee:", error);
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
    const managementFeeId = "d27e902c-977f-48dc-8982-fd9d5dd24e9b";
    const serviceFeeId = "a709f2dc-0534-4a41-8300-6b88b6cbc953";
    const motorFeeId = "e3b0486d-394e-46a7-9d26-31ea0cd2431f";
    const carFeeId = "971f6415-25bd-4194-ab98-b9c689fb95ae";
    const records = await FeeHousehold.findAll({
      where: {
        feeServiceId: {
          [Op.in]: [managementFeeId, serviceFeeId, motorFeeId, carFeeId]
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
      message: "Fetched all management, service, and vehicle fee records",
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
const getHouseholdFeePerMonth = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: month',
    });
  }
  try {
    const households = await Household.findAll({
      attributes: ['id', 'area'],
      where: {
        isActive: true
      },
      include: [
        {
          model: FeeHousehold,
          where: { month: month },
          attributes: ['amount', 'status', 'paymentDate', 'feeServiceId', 'id'],
          include: [
            {
              model: FeeService,
              attributes: ['serviceName', 'servicePrice', 'unit'],
            }
          ]
        },
        {
          model: UserHousehold,
          where: { isOwner: true },
          attributes: ['roleInFamily', 'isOwner'],
          include: [
            {
              model: User,
              attributes: ['fullname'],
            }
          ]
        }
      ]
    });

    if (!households) {
      return res.status(404).json({
        success: false,
        message: 'No household found'
      });
    }

    // Custom data: add totalPrice for each household
    const result = households.map(hh => {
      const fees = hh.FeeHouseholds || [];
      const totalPrice = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
      const owner = hh.UserHouseholds && hh.UserHouseholds[0] && hh.UserHouseholds[0].User;
      const ownerName = owner ? owner.fullname : null;
      return {
        householdId: hh.id,
        area: hh.area,
        totalPrice,
        fees: fees.map(fee => ({
          id: fee.id,
          amount: fee.amount,
          status: fee.status,
          paymentDate: fee.paymentDate,
          feeServiceId: fee.feeServiceId,
          serviceName: fee.FeeService?.serviceName,
          servicePrice: fee.FeeService?.servicePrice,
          unit: fee.FeeService?.unit,

        })),
        owner: {
          roleInFamily: hh.UserHouseholds && hh.UserHouseholds[0] ? hh.UserHouseholds[0].roleInFamily : null,
          isOwner: hh.UserHouseholds && hh.UserHouseholds[0] ? hh.UserHouseholds[0].isOwner : null,
          fullname: ownerName
        }
      };
    });

    res.status(200).json({
      success: true,
      message: 'Get household fee per month successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const updatePayment = async (req, res) => {
  const {id} = req.body
  try {
    const response = await FeeHousehold.findByPk(id);
    if(!response || response.status === 'paid'){
      return res.status(404).json({
        success: false,
        message: "Đã thanh toán rồi"
      })
    }
    await FeeHousehold.update({
      status: 'paid',
      paymentDate: new Date(),
    }, {
      where: {
        id: id
      }
    });
    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
    });
  } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
  }
}
const addContribution = async (req, res) => {
  const {name, description, startDate, endDate, goal, donate} = req.body;
  if (!name || !description || !startDate || !endDate || !goal) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, description, startDate, endDate, goal',
    });
  }
  try {
    await Contribution.create({
      name,
      description,
      startDate,
      endDate,
      goal,
      donate: donate || 0
    });
    return res.status(201).json({
      success: true,
      message: 'Contribution created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
const getFeeCollectionData = async (req, res) => {
  try {
    // Lấy tổng amount theo từng tháng
    const { fn, col } = require('sequelize');
    const results = await FeeHousehold.findAll({
      attributes: [
        [fn('LEFT', col('month'), 7), 'month'],
        [fn('SUM', col('amount')), 'amount']
      ],
      group: ['month'],
      order: [[col('month'), 'ASC']],
      raw: true
    });

    // Map tháng từ 'YYYY-MM' sang 'Jan', 'Feb', ...
    const monthMap = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    const data = results.map(item => {
      const monthNum = item.month.split('-')[1];
      return {
        month: monthMap[monthNum] || item.month,
        amount: Number(item.amount)
      };
    });

    res.status(200).json({
      success: true,
      message: 'Get fee collection data successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const getFeeTypeDistribution = async (req, res) => {
  try {
    // Lấy tổng số tiền từng loại phí từ FeeService và FeeHousehold
    const { fn, col } = require('sequelize');
    // Lấy các loại phí và tổng amount từng loại
    const feeTypeResults = await FeeHousehold.findAll({
      include: [{
        model: FeeService,
        attributes: ['type']
      }],
      attributes: [
        [fn('COALESCE', col('FeeService.type'), 'Khác'), 'type'],
        [fn('SUM', col('amount')), 'total']
      ],
      group: ['FeeService.type'],
      raw: true
    });

    // Lấy tổng quyên góp
    const contributionResult = await ContributionPayment.findAll({
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true
    });

    // Chuẩn hóa dữ liệu
    const typeMap = {
      'Quản lý': 'Quản lý',
      'Dịch vụ': 'Dịch vụ',
      'Đỗ xe': 'Đỗ xe',
      'Tiện ích': 'Tiện ích',
      'Điện': 'Tiện ích',
      'Nước': 'Tiện ích',
      'Internet': 'Tiện ích',
      'Khác': 'Khác'
    };

    // Gom nhóm các loại tiện ích vào 'Tiện ích'
    const distribution = {};
    feeTypeResults.forEach(item => {
      const mapped = typeMap[item.type] || 'Khác';
      if (!distribution[mapped]) distribution[mapped] = 0;
      distribution[mapped] += Number(item.total);
    });

    // Thêm quyên góp
    const contributionTotal = Number(contributionResult[0]?.total || 0);
    distribution['Quyên góp'] = contributionTotal;

    // Tính tổng tất cả
    const total = Object.values(distribution).reduce((sum, v) => sum + v, 0);

    // Tính phần trăm và trả về đúng format
    const data = [
      { name: 'Quản lý', value: 0 },
      { name: 'Dịch vụ', value: 0 },
      { name: 'Đỗ xe', value: 0 },
      { name: 'Tiện ích', value: 0 },
      { name: 'Quyên góp', value: 0 }
    ];
    data.forEach(item => {
      if (distribution[item.name]) {
        item.value = total > 0 ? Math.round((distribution[item.name] / total) * 100) : 0;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Get fee type distribution successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
const getActiveCampaigns = async (req, res) => {
  try {
    // Lấy các chiến dịch quyên góp còn hạn (endDate >= hôm nay)
    const today = new Date();
    const campaigns = await Contribution.findAll({
      where: {
        endDate: { [Op.gte]: today }
      },
      attributes: ['name', 'description', 'endDate', 'goal'],
      raw: true
    });

    // Lấy tổng số tiền đã quyên góp cho từng campaign
    const payments = await ContributionPayment.findAll({
      attributes: [
        'contributionId',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'collected']
      ],
      group: ['contributionId'],
      raw: true
    });

    // Map contributionId -> collected
    const collectedMap = {};
    payments.forEach(p => {
      collectedMap[p.contributionId] = Number(p.collected || 0);
    });

    // Lấy id cho từng campaign
    const allCampaigns = await Contribution.findAll({
      where: {
        endDate: { [Op.gte]: today }
      },
      attributes: ['id', 'name'],
      raw: true
    });
    const idMap = {};
    allCampaigns.forEach(c => { idMap[c.name] = c.id; });

    // Format kết quả
    const result = campaigns.map(c => ({
      name: c.name,
      description: c.description,
      end: c.endDate,
      collected: collectedMap[idMap[c.name]] || 0,
      target: c.goal
    }));

    res.status(200).json({
      success: true,
      message: 'Get active campaigns successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

const getContribution = async (req, res) => {
  try {
    const response = await Contribution.findAll();
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'No contribution found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Get contribution successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
const getTotalHouseholds = async (req, res) => {
  try {
    const total = await Household.count({ where: { isActive: true } });
    res.status(200).json({
      success: true,
      message: "Get total households successfully",
      total});
    } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })}
  }
const getUnpaidHouseholds = async (req, res) => {
  try {
    // Lấy tháng hiện tại
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${yyyy}-${mm}`;

    // Lấy danh sách householdId đang active
    const activeHouseholds = await Household.findAll({
      where: { isActive: true },
      attributes: ['id'],
      raw: true
    });
    const activeIds = activeHouseholds.map(h => h.id);

    // Lấy householdId có ít nhất 1 khoản phí chưa paid trong tháng hiện tại
    const unpaid = await FeeHousehold.findAll({
      where: {
        month: currentMonth,
        status: { [Op.ne]: 'paid' },
        householdId: { [Op.in]: activeIds }
      },
      attributes: ['householdId'],
      group: ['householdId'],
      raw: true
    });

    res.status(200).json({
      success: true,
      message: "Get unpaid households successfully",
      unpaidCount: unpaid.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

// API trả về tổng phí đã thu, tổng phí chưa thu, tổng phí phải thu (tháng hiện tại)
const getFeeSummary = async (req, res) => {
  try {
    // Lấy tháng hiện tại
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${yyyy}-${mm}`;

    // Tổng phí đã thu (status = 'paid')
    const { fn, col } = require('sequelize');
    const paidResult = await FeeHousehold.findAll({
      where: { month: currentMonth, status: 'paid' },
      attributes: [[fn('SUM', col('amount')), 'totalPaid']],
      raw: true
    });
    const totalPaid = Number(paidResult[0]?.totalPaid || 0);

    // Tổng phí chưa thu (status != 'paid')
    const unpaidResult = await FeeHousehold.findAll({
      where: { month: currentMonth, status: { [Op.ne]: 'paid' } },
      attributes: [[fn('SUM', col('amount')), 'totalUnpaid']],
      raw: true
    });
    const totalUnpaid = Number(unpaidResult[0]?.totalUnpaid || 0);

    // Tổng phí phải thu (tất cả)
    const allResult = await FeeHousehold.findAll({
      where: { month: currentMonth },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true
    });
    const total = Number(allResult[0]?.total || 0);

    res.status(200).json({
      success: true,
      message: "Get fee summary successfully",
      totalPaid,
      totalUnpaid,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Báo cáo: Tổng thu theo tháng (dữ liệu đã có: getFeeCollectionData)
// Báo cáo: Thu phí theo loại (dữ liệu đã có: getFeeTypeDistribution)

// Báo cáo: Danh sách hộ gia đình chưa thanh toán trong tháng
const getUnpaidHouseholdDetails = async (req, res) => {
  try {
    // Lấy tháng hiện tại hoặc từ query
    let { month } = req.query;
    if (!month) {
      const currentDate = new Date();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      month = `${yyyy}-${mm}`;
    }

    // Lấy tất cả household đang active
    const households = await Household.findAll({
      where: { isActive: true },
      attributes: ['id', 'apartmentNumber'],
      include: [
        {
          model: UserHousehold,
          where: { isOwner: true },
          attributes: [],
          include: [
            {
              model: User,
              attributes: ['fullname'],
            }
          ]
        }
      ],
      raw: true,
      nest: true
    });

    // Lấy tổng số tiền chưa thanh toán của từng household trong tháng
    const unpaid = await FeeHousehold.findAll({
      where: {
        month,
        status: { [Op.ne]: 'paid' }
      },
      attributes: [
        'householdId',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'unpaidAmount']
      ],
      group: ['householdId'],
      raw: true
    });

    // Map householdId -> unpaidAmount
    const unpaidMap = {};
    unpaid.forEach(item => {
      unpaidMap[item.householdId] = Number(item.unpaidAmount || 0);
    });

    // Kết hợp thông tin household, chủ hộ, số tiền chưa thanh toán
    const result = households
      .filter(hh => unpaidMap[hh.id] > 0)
      .map(hh => ({
        household: hh.apartmentNumber || hh.id,
        owner: hh.UserHouseholds?.User?.fullname || "",
        unpaidAmount: unpaidMap[hh.id]
      }));

    res.status(200).json({
      success: true,
      message: "Get unpaid household details successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const addHouseholdToContribution = async (req, res) => {
  const {contributionId, householdId, amount} = req.body;
  if (!contributionId || !householdId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: contributionId, householdId, amount',
    });
  }
  try {
    const isExist = await ContributionPayment.findOne({
      where: {
        contributionId,
        householdId
      }
    });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: 'Household already exists in this contribution'
      });
    }
    const contribution = await Contribution.findByPk(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }
    const household = await Household.findByPk(householdId);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }
    if(amount > contribution.goal - contribution.donate) {
      return res.status(400).json({
        success: false,
        message: 'Amount exceeds the remaining goal of the contribution'
      });
    }
    await ContributionPayment.create({
      contributionId,
      householdId,
      amount,
      paymentDate: new Date()
    });
    // Cập nhật số tiền đã quyên góp trong Contribution
    await Contribution.update({
      donate: contribution.donate + amount
    }, {
      where: {
        id: contributionId
      }
    })
    return res.status(201).json({
      success: true,
      message: 'Household added to contribution successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });  
  }
}
const getContributionPayment = async (req, res) => {
  try {
    const response = await ContributionPayment.findAll({
      include: [
        {
          model: Contribution,
          attributes: ['name']
        },
      ],
      raw: true,
      nest: true
    })
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'No contribution payment found'
      });
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: 'Internal server error',
      error: error.message
    });
  }
}
const deleteHousehold = async (req, res) => {
  const {householdId} = req.body;
  if (!householdId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: householdId',
    });
  }
  const isHousehold = await UserHousehold.findOne({
    where: {
      householdId: householdId
    }
  });
  if (!isHousehold) {
    return res.status(404).json({
      success: false,
      message: 'Household not found',
    });
  };
  try {
  const userInHousehold = await UserHousehold.findAll({
    attributes: ['userId'],
    where: {
      householdId: householdId
    }
  });
  if (userInHousehold.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No users found in this household',
    });
  }
  const userIds = userInHousehold.map(record => record.userId);
  await UserHousehold.destroy({
    where: { householdId },
  });
  await Vehicle.destroy({
    where: { householdId }
  })
  await FeeHousehold.destroy({
    where: { householdId }
  });
  const affectedRows = await Household.update(
    { isActive: false },
    { where: { id: householdId } }
  );
  console.log(affectedRows)
  await User.destroy({
    where:{ id: {[Op.in]: userIds}}
  });

  return res.status(200).json({
    success: true,
    message: 'Household and associated users deleted successfully',
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}      
      
      
// Lấy thông tin đăng ký hộ khẩu: Thường trú, Tạm trú
const getUserResidenceInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required param: userId"
      });
    }
    const user = await User.findByPk(userId, {
      attributes: ['permanentResidence', 'temporaryResidence']
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get user residence info successfully",
      permanentResidence: user.permanentResidence,
      temporaryResidence: user.temporaryResidence
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
const getAddressUser = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: ['id', 'fullname', 'permanentResidence', 'temporaryResidence'],
      include: [{
        model: UserHousehold,
        attributes: ['householdId'],
      }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Get user address successfully',
      data: user
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}


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
  getAllManagementAndServiceFees,
  getHouseholdFeePerMonth,
  updatePayment,
  getFeeCollectionData,
  getFeeTypeDistribution,
  getActiveCampaigns,
  addContribution,
  getContribution,
  getTotalHouseholds,
  getUnpaidHouseholds,
  getFeeSummary,

  getUserResidenceInfo,

  getUnpaidHouseholdDetails,
  addHouseholdToContribution,
  getContributionPayment,
  deleteHousehold,
  getAddressUser

};
