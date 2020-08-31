const express = require('express')

const UserController = require('./controller/UserController')
const AppointmentController = require('./controller/AppointmentController')

const route = express.Router()

route.get('/users', UserController.getUsers)

route.post('/register', UserController.signup)
route.post('/login', UserController.login)

route.post('/activate', UserController.verifyEmail)

route.get('/appointments', AppointmentController.getAppointments)
route.post('/booking', AppointmentController.createAppointment)

module.exports = route
