const { Sequelize } = require('sequelize');
const url = 'postgresql://admin:npg_5RjPZUqTEd1p@ep-royal-band-a250c548-pooler.eu-central-1.aws.neon.tech/BlueMoon?sslmode=require'
const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, 
        },
    },
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;