const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Contribution = sequelize.define('Contribution', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {           
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  goal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  donate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Đang diễn ra', 'Đã hoàn thành', 'Hủy'),
    defaultValue: 'Đang diễn ra'
  }
}, {
  tableName: 'contribution',
  timestamps: true,
});
module.exports = Contribution;