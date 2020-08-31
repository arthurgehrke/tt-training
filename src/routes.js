const express = require('express')

const UserController = require('./controller/UserController')
const AppointmentController = require('./controller/AppointmentController')

const route = express.Router()

route.post('/signup', UserController.signup)
route.post('/login', UserController.login)

route.get('/appointments', AppointmentController.getAppointments)
route.post('/appointments', AppointmentController.createAppointment)

module.exports = route
