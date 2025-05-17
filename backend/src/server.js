const express = require('express')
const app = express();
const sequelize = require('./database');
const route = require('./routes/index');
const dotenv = require('dotenv');
dotenv.config();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
route(app)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

sequelize.sync({ force: false})
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
});