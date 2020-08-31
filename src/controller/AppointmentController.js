require('dotenv').config()

const Appointment = require('../models/Appointments')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { promisify } = require('util') // ???

class AppointmentController {
  async getAppointments(_, res) {
    const appointments = await Appointment.find()

    return res.status(200).json(appointments)
  }

  async createAppointment(req, res) {
    const { start_time, end_time } = req.body
    const [, token] = req.headers.authorization.split(' ')

    function consoleOutput(start, end) {
      start = moment(start).format('llll')
      end = moment(end).format('llll')

      console.log('New Appointment \nStart: ' + start + '\nEnd: ' + end)
    }
    consoleOutput(start_time, end_time)

    try {
      if (moment(end_time).isSameOrBefore(moment(start_time)))
        throw new Error(' Invalid input ')

      const verifyAvailability = await Appointment.findOne({
        $or: [
          { start_time: { $gte: start_time, $lt: end_time } },
          { start_time: { $lt: start_time }, end_time: { $gt: start_time } }
        ]
      })

      if (verifyAvailability)
        throw new Error('This appointment is already taken')

      const decodedToken = await promisify(jwt.verify)(
        token,
        process.env.TOKEN_SECRET
      )

      const appointment = await Appointment.create({
        user_id: decodedToken.userId,
        start_time,
        end_time
      })
      console.log('----Appoitment Created----')
      return res.status(201).json({ appointment })
    } catch (err) {
      console.log('----Appoitment already taken----')
      return res.status(400).json({ err: err.message })
    }
  }
}

module.exports = new AppointmentController()
