const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const FeeHousehold = sequelize.define('FeeHousehold', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    householdId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'households',
            key: 'id',
        },
    },
    feeServiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'fee_services',
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
  tableName: 'fee_households',
  timestamps: true,
});
module.exports = FeeHousehold;