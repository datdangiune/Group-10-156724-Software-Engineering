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
  contributionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'contribution',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  paymentDate: DataTypes.DATE,
  note: DataTypes.STRING,
}, {
  tableName: 'contribution_payments',
  timestamps: true,
});
module.exports = ContributionPayment;