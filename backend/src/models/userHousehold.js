const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const UserHousehold = sequelize.define('UserHousehold', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  householdId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    references: {
      model: 'households',
      key: 'id',
    },
  },
  joinedAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_households',
  timestamps: true,
});

module.exports = UserHousehold;