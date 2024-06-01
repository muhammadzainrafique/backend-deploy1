const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  role:{
    type:String,
    default:"doctor"
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    require: true,
    type: String,
  },
  paitents: [
    {
      doctorsList: {
        doctorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "doctor",
        },
      },
    },
  ],
  hospital: {
    type: String,
    require: true,
  },
  experience:{
    type : Number,
    default:1
  }
});


const doctorModel = new mongoose.model("doctor", doctorSchema);
module.exports = doctorModel;
