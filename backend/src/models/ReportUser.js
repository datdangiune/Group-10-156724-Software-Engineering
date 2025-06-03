const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ReportUser = sequelize.define('ReportUser', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
    topic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Chờ xử lý', 'Đã giải quyết', 'Đang xử lý'),
        allowNull: false,
        defaultValue: 'Chờ xử lý',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'report_users',
    timestamps: true,
});
module.exports = ReportUser;