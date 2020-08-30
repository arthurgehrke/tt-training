const mongoose = require('mongoose')
const { MongoError } = require('mongodb')

const AppointmentSchema = new mongoose.Schema({
    user_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    start_time: { type: String},
    end_time: { type: String},
    status: { type: String, enum: ['Pending', 'Booked','Canceled'], default: 'Pending'}, 
    createdAt: { type: Date, default: Date.now},
  })

module.exports = mongoose.model('Appointment', AppointmentSchema)
