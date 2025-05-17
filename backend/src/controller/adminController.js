const { Household, UserHousehold, User } = require('../models/index');

const getHouseholdUsersInfo = async (req, res) => {
  try {
    const households = await Household.findAll({
      attributes: ['id'],
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
      ]
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

    res.status(200).json({
    message: "Get household users info successfully",
    totalHouseholds: result.length,
    data: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      if (!item.apartmentNumber || !item.area) {
        return res.status(400).json({ message: 'Each household must have apartmentNumber and area' });
      }
    }

    // Tạo nhiều household cùng lúc
    const households = await Household.bulkCreate(householdsData);

    res.status(201).json({
      message: 'Households created successfully',
      data: households,
      totalCreated: households.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.status(201).json({
      message: 'User added to household successfully',
      data: userHousehold
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      if (!user.email || !user.fullname || !user.phoneNumber || !user.gender || !user.cccd) {
        return res.status(400).json({ message: 'Each user must have email, fullname, phoneNumber, gender, cccd' });
      }
    }

    // Tạo users
    const users = await User.bulkCreate(usersData, { validate: true });

    res.status(201).json({
      message: 'Users created successfully',
      data: users,
      totalCreated: users.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHouseholdUsersInfo,
  createHousehold,
  addUserToHousehold,
  createUsers,
};
