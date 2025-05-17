const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ContributionPayment = sequelize.define('ContributionPayment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  householdId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    references: {
      model: 'households',
      key: 'id',
    },
  },
  contributionCampaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'contribution_campaigns',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: { // Tình trạng đóng: 'paid', 'pending', 'exempt' (miễn đóng)
    type: DataTypes.ENUM('paid', 'pending', 'exempt'),
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentDate: DataTypes.DATE,
  note: DataTypes.STRING,
}, {
  tableName: 'contribution_payments',
  timestamps: true,
});
module.exports = ContributionPayment;