const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    plateNumber: {  //biển số xe
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    vehicleType: {
        type: DataTypes.ENUM('car', 'motorcycle', 'bicycle'),
        allowNull: false,
    },
    householdId: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: 'households',
            key: 'id',
        },
        onDelete: 'CASCADE',   // Xóa xe khi hộ bị xóa
    },  
}, {
    tableName: 'vehicles',
    timestamps: true,
});
module.exports = Vehicle;