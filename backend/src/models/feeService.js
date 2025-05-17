const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const FeeService = sequelize.define('FeeService', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Quản lý', 'Dịch vụ', 'Đỗ xe', 'Tiện ích', 'Điện', 'Nước'),
        allowNull: false,
        defaultValue: 'Dịch vụ',
    },
    servicePrice: { 
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false, // ví dụ: m2, căn hộ, lần, chiếc,...
    },
    isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // true nếu bắt buộc
    },
}, {
    tableName: 'fee_services',
    timestamps: true,
});
module.exports = FeeService;