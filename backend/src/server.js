const express = require('express')
const app = express();
const sequelize = require('./database');
const route = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const ReportUser = require('./models/ReportUser');
const FeeHousehold = require('./models/FeeHousehold');
dotenv.config();
const port = 3001;
app.use(cors())

app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
route(app)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// // Hàm chỉ drop và tạo lại bảng users
// async function syncUserTableOnly() {
//   try {
//     await ReportUser.sync({ force: true });
//     console.log('User table synced (dropped and recreated) successfully.');
//   } catch (err) {
//     console.error('Error syncing user table:', err);
//   }
// }

// // Gọi hàm này khi cần drop và tạo lại bảng users
// syncUserTableOnly();

sequelize.sync({force: false}) // Set force: true to drop and recreate the database
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
});
