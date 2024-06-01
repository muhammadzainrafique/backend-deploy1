const mongoose = require("mongoose");

const paitentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
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
  role:{
    type:String,
    default:"paitent"
  },
  appointments:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'appointment'
  },
  visits: [
    {
      visitData: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  doctors: [
    {
      doctorsList: {
        doctorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "doctor",
        },
      },
    },
  ],
});

const paitentModel = new mongoose.model("paitent", paitentSchema);
module.exports = paitentModel;
