const { Household, UserHousehold, User, FeeService, UtilityUsage, FeeHousehold } = require('../models/index');
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

const addHouseholdsToUtilityUsage = async (req, res) => {
  try {
    const { householdId, month, electricity, water, internet } = req.body;
    if (!householdId || !month || electricity == null || water == null || internet == null) {
      return res.status(400).json({ message: 'Missing required fields: householdId, month, electricity, water, internet' });
    }

    // Kiểm tra household tồn tại và isActive
    const household = await Household.findOne({ where: { id: householdId, isActive: true } });
    if (!household) {
      return res.status(404).json({ message: 'Household not found or not active' });
    }

    // Kiểm tra đã tồn tại utility usage cho household này/tháng này chưa
    const existed = await UtilityUsage.findOne({ where: { householdId, month } });
    if (existed) {
      return res.status(400).json({ message: 'Utility usage for this household and month already exists' });
    }

    // Lấy giá điện, nước, internet từ FeeService
    const [electricFee, waterFee, internetFee] = await Promise.all([
      FeeService.findOne({ where: { type: 'Điện' } }),
      FeeService.findOne({ where: { type: 'Nước' } }),
      FeeService.findOne({ where: { type: 'Internet' } }),
    ]);
    console.log(electricFee, waterFee, internetFee);
    if (!electricFee || !waterFee) {
      return res.status(400).json({ message: 'Electricity or water fee service not found' });
    }

    // Tính giá
    const electricity_price = electricity * electricFee.servicePrice;
    const water_price = water * waterFee.servicePrice;
    const internet_price = (internet && internetFee) ? internetFee.servicePrice : 0;
    const total_price = electricity_price + water_price + internet_price;

    const usage = await UtilityUsage.create({
      householdId,
      month,
      electricity,
      water,
      internet,
      internet_price,
      electricity_price,
      water_price,
      total_price
    });

    res.status(201).json({
      success: true,
      message: 'Utility usage created successfully',
      data: usage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const getUtilityUsage = async (req, res) => {
  try {
    const data = await UtilityUsage.findAll()
    if (!data) {
      return res.status(404).json({ success: false, message: 'No utility usage found' });
    }
    res.status(200).json({
      success: true,
      message: 'Get utility usage successfully',
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const autoCreateFeeHouseholdForNewMonth = async (req, res) => {
  try {
    // Lấy tháng hiện tại dạng YYYY-MM
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Tính ngày đầu tháng này và tháng kế tiếp
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // cộng thêm 1 tháng

    // Lấy các household đang hoạt động
    const households = await Household.findAll({ where: { isActive: true } });

    // Lấy các feeService mặc định (Quản lý, Dịch vụ)
    const feeServices = await FeeService.findAll({
      where: { type: ['Quản lý', 'Dịch vụ'] }
    });

    if (!feeServices.length) {
      return res.status(400).json({ success: false, message: 'No default fee services found' });
    }

    const feeHouseholdToCreate = [];

    for (const household of households) {
      for (const fee of feeServices) {
        // Kiểm tra đã tồn tại chưa (tránh tạo trùng trong tháng)
        const existed = await FeeHousehold.findOne({
          where: {
            householdId: household.id,
            feeServiceId: fee.id,
            createdAt: {
              [Op.gte]: startOfMonth,
              [Op.lt]: endOfMonth
            }
          }
        });
        if (existed) continue;

        // Tính amount = price * diện tích
        const amount = fee.servicePrice * household.area;
        feeHouseholdToCreate.push({
          householdId: household.id,
          feeServiceId: fee.id,
          amount
        });
      }
    }

    if (!feeHouseholdToCreate.length) {
      return res.status(200).json({ success: true, message: 'No new feeHousehold records to create for this month' });
    }

    const created = await FeeHousehold.bulkCreate(feeHouseholdToCreate);

    res.status(201).json({
      success: true,
      message: 'FeeHousehold records created for active households for this month',
      totalCreated: created.length,
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
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
    res.status(500).json({ success: false, error: error.message });
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
module.exports = {
  getHouseholdUsersInfo,
  createHousehold,
  addUserToHousehold,
  createUsers,
  getAllUsersInHousehold,
  addFeeService,
  getFeeService,
  addHouseholdsToUtilityUsage,
  getUtilityUsage,
  autoCreateFeeHouseholdForNewMonth,
  addHouseholdAndUser,
  getHouseholdUnactive
};
