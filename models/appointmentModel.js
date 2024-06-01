const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({
    paitent: { type: mongoose.Schema.Types.ObjectId, ref: 'paitent', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  });
  
 const  appointmentModel = new mongoose.model('Appointment', appointmentSchema);
 module.exports = appointmentModel
  