const express = require('express')
const app = express()
const sequelize = require('./database');
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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