const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    plateNumber: {  
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    vehicleType: {
        type: DataTypes.ENUM('Xe máy', 'Ô tô', 'Xe đạp'),
        allowNull: false,
    },
    householdId: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: 'households',
            key: 'id',
        },
        onDelete: 'CASCADE',  
    },
    pricePerMonth: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }, 
}, {
    tableName: 'vehicles',
    timestamps: true,
});
module.exports = Vehicle;