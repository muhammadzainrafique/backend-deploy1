const Admin = require("../models/adminModel");
const asyncHandler = require("express-async-handler");
const { createResponse, bcryptPassword } = require("../utils/helperFunction");
const { getToken } = require("../utils/getToken");

const createNewAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name  || !password || !email)
    return createResponse(res, false, 400, "All fields are required");

  const duplicateEmail = await Admin.findOne({ email }).lean();
  if (duplicateEmail)
    return createResponse(res, false, 400, "Email is already Registered");
  const hashedPassword = await bcryptPassword(password);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });
  console.log('admin',admin);

  if (!admin) return createResponse(res, false, 400, "Invlid data");
  const { accessToken, refreshToken } = await getToken(admin);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:admin?._id, role:admin?.role});
});

const getAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return createResponse(res, false, 400, "Id is required");
    const admin = await Admin.findById(id);
    if (!admin) return createResponse(res, false, 400, "admin Not Found");
  console.log(admin)
    createResponse(res, true, 200, admin);
});

const getAllAdmin = asyncHandler(async (req, res) => {
    const admins = await Admin.find({}).lean();
    if (!admins) return createResponse(res, false, 400, "admins Not Found");
  
    createResponse(res, true, 200, admins);
});

const updateAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
    if ( !id)
      return createResponse(res, false, 400, "Id is requried");
    const admin = await Admin.findById(id);
    if (!admin) return createResponse(res, false, 400, "paitent Not Found");
    if (username) {
      const duplicateUsername = await Admin.findOne({ username }).lean();
      if (duplicateUsername && duplicateUsername._id.toString() !== id)
          return createResponse(res, false, 400, "username is Already Exist");
    }
    if (email) {
      const duplicateEmail = await Admin.findOne({ email }).lean();
      if ( duplicateEmail && duplicateEmail?._id?.toString()!== id)
        return createResponse(res, false, 400, "Email is already Registered");
    }
    if(password){
      const hashedPassword = await bcryptPassword(password);
      admin.password = hashedPassword || admin.password;
    }
  
    admin.username = username || admin.username;
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.experience = experience || admin.experience;
    
    await admin.save();
  
    createResponse(res, true, 200, "updating doctor");
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return createResponse(res, false, 400, "Id is required");
    const admin = Admin.find({}).lean();
    if (!admin) return createResponse(res, false, 400, "admin Not Found");
  
    await admin.delete();
    createResponse(res, true, 200, "admin Deleted");
});

module.exports = {
  createNewAdmin,
  getAllAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
