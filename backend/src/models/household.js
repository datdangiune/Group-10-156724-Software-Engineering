const { DataTypes } = require('sequelize');
const sequelize = require('../database');



const Household = sequelize.define('Household', {
    id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
    },
    apartmentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    area: {  //Diện tích
        type: DataTypes.FLOAT,
        allowNull: false,
    }, 
    isActive: { //Trạng thái hoạt động
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'households',
    timestamps: true,
});

module.exports = Household;