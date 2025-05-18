const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Household = require('./household');

const UtilityUsage = sequelize.define('UtilityUsage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    householdId: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: Household,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    month: {
        type: DataTypes.STRING(7), 
        allowNull: false,
    },
    electricity: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    water: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    internet: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },  
    electricity_price: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    water_price: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    internet_price: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    total_price: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        defaultValue: 0,
    },
    status_electric_payment: {
        type: DataTypes.ENUM('paid', 'pending', 'exempt'),
        allowNull: false,
        defaultValue: 'pending',
    },
    status_water_payment: {
        type: DataTypes.ENUM('paid', 'pending', 'exempt'),
        allowNull: false,
        defaultValue: 'pending',
    },
    status_internet_payment: {
        type: DataTypes.ENUM('paid', 'pending', 'exempt'),
        allowNull: false,
        defaultValue: 'pending',
    },
    status_total_payment: {
        type: DataTypes.ENUM('paid', 'pending', 'exempt'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    tableName: 'utility_usages',
    timestamps: true,
    uniqueKeys: {
        unique_household_month: {
            fields: ['householdId', 'month']
        }
    }
});

module.exports = UtilityUsage;
