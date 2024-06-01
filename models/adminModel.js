const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
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
    default:"admin"
  }
});

const adminModel = new mongoose.model("admin", adminSchema);
module.exports = adminModel;
