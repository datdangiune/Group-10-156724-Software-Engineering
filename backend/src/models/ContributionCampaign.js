const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ContributionCampaign = sequelize.define('ContributionCampaign', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  contributionFundId: {   // Khoản đóng góp thuộc quỹ nào
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'contribution_funds',
      key: 'id',
    },
  },
  name: {                 // Tên đợt thu (ví dụ: Thu quỹ vì người nghèo năm 2025)
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: DataTypes.TEXT,
}, {
  tableName: 'contribution_campaigns',
  timestamps: true,
});
module.exports = ContributionCampaign;