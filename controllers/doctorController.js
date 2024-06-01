const Doctor = require("../models/doctorModel");
const asyncHandler = require("express-async-handler");
const { createResponse, bcryptPassword } = require("../utils/helperFunction");
const { getToken } = require("../utils/getToken");

const createNewDoctor = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !password || !email)
    return createResponse(res, false, 400, "All fields are required");

  const duplicateEmail = await Doctor.findOne({ email }).lean();
  if (duplicateEmail)
    return createResponse(res, false, 400, "Email is already Registered");

  const duplicateUserName = await Doctor.findOne({ username }).lean();
  if (duplicateUserName)
    return createResponse(res, false, 400, "username is Already Exist");
  const hashedPassword = await bcryptPassword(password);

  const doctor = await Doctor.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  if (!doctor) return createResponse(res, false, 400, "Invlid data");
  const { accessToken, refreshToken } = await getToken(doctor);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:doctor?._id, role:doctor?.role});
});

const getDoctor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return createResponse(res, false, 400, "Id is required");
    const doctor = await Doctor.findById(id);
    if (!doctor) return createResponse(res, false, 400, "doctor Not Found");
  console.log(doctor)
    createResponse(res, true, 200, doctor);
});

const getAllDoctor = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({}).lean();
    if (!doctors) return createResponse(res, false, 400, "doctors Not Found");
  
    createResponse(res, true, 200, doctors);
});

const updateDoctor = asyncHandler(async (req, res) => {
    const { name, username, email, password, experience } = req.body;
    const { id } = req.params;
    if ( !id)
      return createResponse(res, false, 400, "Id is requried");
    const doctor = await Doctor.findById(id);
    if (!doctor) return createResponse(res, false, 400, "paitent Not Found");
    if (username) {
      const duplicateUsername = await Doctor.findOne({ username }).lean();
      if (duplicateUsername && duplicateUsername._id.toString() !== id)
          return createResponse(res, false, 400, "username is Already Exist");
    }
    if (email) {
      const duplicateEmail = await Doctor.findOne({ email }).lean();
      if ( duplicateEmail && duplicateEmail?._id?.toString()!== id)
        return createResponse(res, false, 400, "Email is already Registered");
    }
    if(password){
      const hashedPassword = await bcryptPassword(password);
      doctor.password = hashedPassword || doctor.password;
    }
  
    doctor.username = username || doctor.username;
    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.experience = experience || doctor.experience;
    
    await doctor.save();
  
    createResponse(res, true, 200, "updating doctor");
});

const deleteDoctor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return createResponse(res, false, 400, "Id is required");
    const doctor = Doctor.find({}).lean();
    if (!doctor) return createResponse(res, false, 400, "doctor Not Found");
  
    await doctor.delete();
    createResponse(res, true, 200, "doctor Deleted");
});

module.exports = {
  createNewDoctor,
  getAllDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
