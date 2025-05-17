const { DataTypes } = require('sequelize');
const sequelize = require('../database');

function generateUniqueTimeId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const now = new Date();

    // 2 chữ cái ngẫu nhiên
    const randomLetters = 
        letters[Math.floor(Math.random() * 26)] + 
        letters[Math.floor(Math.random() * 26)];

    // Lấy mili giây hiện tại và chuyển thành 4 số cuối
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // 000-999
    const randomNum = Math.floor(Math.random() * 10); // 0-9

    // Kết hợp mili giây + số ngẫu nhiên để tạo 4 số
    const uniquePart = (milliseconds + randomNum).slice(-4); // Ví dụ: "0427"

    return randomLetters + uniquePart; // Ví dụ: "AB0427"
}

const Household = sequelize.define('Household', {
    id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        defaultValue: generateUniqueTimeId,
    },
    apartmentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    area: {  //Diện tích
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    tableName: 'households',
    timestamps: true,
});

module.exports = Household;