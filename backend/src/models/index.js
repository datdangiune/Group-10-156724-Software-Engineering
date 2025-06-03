const User = require('./user');
const Household = require('./household');
const UserHousehold = require('./userHousehold');
const Vehicle = require('./vehicle');
const FeeService = require('./feeService');
const FeeHousehold = require('./FeeHousehold');
const Contribution = require('./Contribution');
const ContributionPayment = require('./ContributionPayment');
const ReportUser = require('./ReportUser'); // Thêm dòng này


// User - UserHousehold - Household

UserHousehold.belongsTo(User, { foreignKey: 'userId' });
UserHousehold.belongsTo(Household, { foreignKey: 'householdId' });
User.hasMany(UserHousehold, { foreignKey: 'userId' });
Household.hasMany(UserHousehold, { foreignKey: 'householdId' });

// Household - Vehicle
Household.hasMany(Vehicle, { foreignKey: 'householdId' });
Vehicle.belongsTo(Household, { foreignKey: 'householdId' });

// FeeService - FeeHousehold - Household
FeeService.hasMany(FeeHousehold, { foreignKey: 'feeServiceId' });
FeeHousehold.belongsTo(FeeService, { foreignKey: 'feeServiceId' });
Household.hasMany(FeeHousehold, { foreignKey: 'householdId' });
FeeHousehold.belongsTo(Household, { foreignKey: 'householdId' });

// Contribution - ContributionPayment - Household
Contribution.hasMany(ContributionPayment, { foreignKey: 'contributionId' });
ContributionPayment.belongsTo(Contribution, { foreignKey: 'contributionId' });

Household.hasMany(ContributionPayment, { foreignKey: 'householdId' });
ContributionPayment.belongsTo(Household, { foreignKey: 'householdId' });

// ReportUser - User - Household
ReportUser.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ReportUser, { foreignKey: 'userId' });

ReportUser.belongsTo(Household, { foreignKey: 'householdId' });
Household.hasMany(ReportUser, { foreignKey: 'householdId' });



// Export models nếu cần
module.exports = {
  User,
  Household,
  UserHousehold,
  Vehicle,
  FeeService,
  FeeHousehold,
  Contribution,
  ContributionPayment,
  ReportUser // Thêm dòng này
};