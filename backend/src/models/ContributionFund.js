const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ContributionFund = sequelize.define('ContributionFund', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {           // Tên quỹ
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: DataTypes.TEXT,  // Mô tả
}, {
  tableName: 'contribution_funds',
  timestamps: true,
});
module.exports = ContributionFund;