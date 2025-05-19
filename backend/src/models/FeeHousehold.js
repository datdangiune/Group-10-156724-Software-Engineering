const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const FeeHousehold = sequelize.define('FeeHousehold', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    householdId: {
        type: DataTypes.STRING(6),
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
    month: {
        type: DataTypes.STRING(7), // YYYY-MM
        allowNull: false,
    },
    water: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    electricity: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    internet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
  tableName: 'fee_households',
  timestamps: true,
});
module.exports = FeeHousehold;