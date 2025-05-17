const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleInFamily: {
        type: DataTypes.ENUM('Chồng', 'Vợ', 'Con', 'Chủ Hộ'),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Nam', 'Nữ'),
        allowNull: false,
    },
    cccd: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
});
module.exports = User;