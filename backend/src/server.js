const express = require('express')
const app = express();
const sequelize = require('./database');
const route = require('./routes/index');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { autoCreateFeeHouseholdForNewMonth } = require('./controller/adminController');
dotenv.config();
const port = 3000;
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
route(app)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

sequelize.sync({ force: false}) // Set force: true to drop and recreate the database
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
});
cron.schedule('0 0 1 * *', () => {
  console.log('Running monthly FeeHousehold generation job');
  autoCreateFeeHouseholdForNewMonth(
    {
      body: {}, // giả req
    },
    {
      status: (code) => ({
        json: (data) => console.log(`Status ${code}`, data),
      }),
    }
  );
});