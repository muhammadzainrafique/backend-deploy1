const Paitent = require("../models/paitentModel");
const asyncHandler = require("express-async-handler");
const { createResponse, bcryptPassword } = require("../utils/helperFunction");
const { getToken } = require("../utils/getToken");

const createNewPaitent = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !password || !email)
    return createResponse(res, false, 400, "All fields are required");

  const duplicateEmail = await Paitent.findOne({ email }).lean();
  if (duplicateEmail)
    return createResponse(res, false, 400, "Email is already Registered");

  const duplicateUserName = await Paitent.findOne({ username }).lean();
  if (duplicateUserName)
    return createResponse(res, false, 400, "username is Already Exist");
  const hashedPassword = await bcryptPassword(password);

  const paitent = await Paitent.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  if (!paitent) return createResponse(res, false, 400, "Invlid data");
  const { accessToken, refreshToken } = getToken(paitent);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:paitent?._id});
});

const getPaitent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, false, 400, "Id is required");
  const paitent = await Paitent.findById(id).lean();
  if (!paitent) return createResponse(res, false, 400, "Paitent Not Found");

  createResponse(res, true, 200, paitent);
});

const getAllPaitent = asyncHandler(async (req, res) => {
  const paitents = await Paitent.find({}).lean();
  if (!paitents) return createResponse(res, false, 400, "Paitent Not Found");

  createResponse(res, true, 200, paitents);
});

const updatePaitent = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const { id } = req.params;
  if (!id)
    return createResponse(res, false, 400, "Id is required");
  const paitent = await Paitent.findById(id);
  if (!paitent) return createResponse(res, false, 400, "Paitent Not Found");
  if (username) {
    const duplicateUsername = await Paitent.findOne({ username }).lean();
    if (duplicateUsername && duplicateUsername._id.toString() !== id)
        return createResponse(res, false, 400, "username is Already Exist");
  }
  if (email) {
    const duplicateEmail = await Paitent.findOne({ email }).lean();
    if ( duplicateEmail && duplicateEmail?._id?.toString()!== id)
      return createResponse(res, false, 400, "Email is already Registered");
  }
  if(password){
    const hashedPassword = await bcryptPassword(password);
    paitent.password = hashedPassword || paitent.password;
  }

  paitent.username = username || paitent.username;
  paitent.name = name || paitent.name;
  paitent.email = email || paitent.email;
  
  await paitent.save();

  createResponse(res, true, 200, "updating paitent");
});

const deletePaitent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return createResponse(res, false, 400, "Id is required");
  const paitent = Paitent.find({}).lean();
  if (!paitent) return createResponse(res, false, 400, "Paitent Not Found");

  await paitent.delete();
  createResponse(res, true, 200, "Paitent Deleted");
});

module.exports = {
  createNewPaitent,
  getAllPaitent,
  getPaitent,
  updatePaitent,
  deletePaitent,
};
