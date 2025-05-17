const User = require('./user');
const Household = require('./household');
const UserHousehold = require('./userHousehold');
const Vehicle = require('./vehicle');
const FeeService = require('./feeService');
const FeeHousehold = require('./FeeHousehold');
const ContributionFund = require('./ContributionFund');
const ContributionCampaign = require('./ContributionCampaign');
const ContributionPayment = require('./ContributionPayment');

// User - UserHousehold - Household
User.belongsToMany(Household, { through: UserHousehold, foreignKey: 'userId', otherKey: 'householdId' });
Household.belongsToMany(User, { through: UserHousehold, foreignKey: 'householdId', otherKey: 'userId' });
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

// ContributionFund - ContributionCampaign
ContributionFund.hasMany(ContributionCampaign, { foreignKey: 'contributionFundId' });
ContributionCampaign.belongsTo(ContributionFund, { foreignKey: 'contributionFundId' });

// ContributionCampaign - ContributionPayment - Household
ContributionCampaign.hasMany(ContributionPayment, { foreignKey: 'contributionCampaignId' });
ContributionPayment.belongsTo(ContributionCampaign, { foreignKey: 'contributionCampaignId' });
Household.hasMany(ContributionPayment, { foreignKey: 'householdId' });
ContributionPayment.belongsTo(Household, { foreignKey: 'householdId' });

// Export models nếu cần
module.exports = {
  User,
  Household,
  UserHousehold,
  Vehicle,
  FeeService,
  FeeHousehold,
  ContributionFund,
  ContributionCampaign,
  ContributionPayment,
};
