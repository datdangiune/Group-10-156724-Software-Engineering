const express = require('express')
const app = express();
const sequelize = require('./database');
const route = require('./routes/index');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const port = 3000;
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
route(app)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

sequelize.sync({ force: false}) // Set to true to drop and recreate tables
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
});