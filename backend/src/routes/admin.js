const express = require('express')
const route = express.Router()
const adminController = require('../controller/adminController')
const {verifyTokenAdmin} = require('../middleware/veritify')
route.get('/household', verifyTokenAdmin, adminController.getHouseholdUsersInfo)
route.post('/household', verifyTokenAdmin, adminController.createHousehold)
route.post('/addUserToHousehold', verifyTokenAdmin, adminController.addUserToHousehold)
route.post('/addUser', verifyTokenAdmin, adminController.createUsers)
module.exports = route