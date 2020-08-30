require('dotenv').config()

const Appointment = require('../models/Appointments')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { promisify } = require('util') 

class AppointmentController {
    async getAppointments(req,res) {
        const appointments = await Appointment.find()

        return res.status(200).json(appointments)
    }


    async createAppointment(req,res){
        const { start_time, end_time } = req.body
        const [, token] = req.headers.authorization.split(' ')

        try{ 
            const verifyAvailability = await Appointment.findOne({ start_time })

            if(verifyAvailability) throw new Error('This appointment is already taken')
            const formatedDate = moment().hour(start_time)

            const decodedToken = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET)
            
            const appointment = await Appointment.create({ user_id: decodedToken.userId, start_time, end_time})
            
            return res.status(201).json({appointment})
        } catch(err){
            return res.status(400).json({err: err.message})
        }
    } 
}

module.exports = new AppointmentController()
