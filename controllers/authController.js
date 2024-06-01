const asyncHandler = require("express-async-handler")
const  bcrypt = require('bcrypt')
const  { createResponse } = require("../utils/helperFunction.js");
const Doctor  = require("../models/doctorModel.js");
const Paitent  = require("../models/paitentModel.js");
const Admin  = require("../models/adminModel.js");
const { getToken } = require('../utils/getToken.js');
// const  jwt = require('jsonwebtoken')

// public , for registration of new user
// export const registerUser = asyncHandler ( async (req, res)=> {
//     const { name, username, password } = req.body;
//     if(!name || !username || !password)
//         return createResponse(res, 400, false, "All fields are required")
//     // checking for duplicate username
//     const duplicateUser = await User.findOne({username}).lean();
//     if(duplicateUser)
//         return createResponse(res, 400, false, "User Already Exist")
//     const bcryptedPassword = await bcryptPassword(password);
//     const user = await User.create({name, username, password:bcryptedPassword})
//     if(!user)
//         return createResponse(res, 400, false, "Invalid Data")

//     const { accessToken, refreshToken } = getToken(user);
//     res.cookie('jwt', refreshToken, {
//         httpOnly:true,
//         secure:true,
//         sameSite:'none',
//         maxAge:7*24*60*60*1000
//     })


//     createResponse(res, 200, true, {accessToken, userId:user?._id});
// })

// public , for registration of new user
 const authDoctor = asyncHandler ( async (req, res)=> {
    const { username, password } = req.body;
    if(!username || !password)
        return createResponse(res, false, 400, "All Fields are required")

    const doctor = await Doctor.findOne({username}).lean();
    if(!doctor)
        return createResponse(res, false, 400, "Invalid Username")
    const checkPassword =  await bcrypt.compare(password, doctor?.password);
    if(!checkPassword)
        return createResponse(res, false, 400, "Invlaid Password");
    const { accessToken, refreshToken } = await getToken(doctor);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:doctor?._id, role:doctor?.role});
})

const authAdmin = asyncHandler ( async (req, res)=> {
    const { email, password } = req.body;
    if(!email || !password)
        return createResponse(res, false, 400, "All Fields are required")

    const admin = await Admin.findOne({email}).lean();
    if(!admin)
        return createResponse(res, false, 400, "Invalid Username")
    const checkPassword =  await bcrypt.compare(password, admin?.password);
    if(!checkPassword)
        return createResponse(res, false, 400, "Invlaid Password");
    const { accessToken, refreshToken } = await getToken(admin);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:admin?._id, role:admin?.role});
})

// auth paitent
const authPaitent = asyncHandler ( async (req, res)=> {
    const { username, password } = req.body;
    if(!username || !password)
        return createResponse(res, false, 400, "All Fields are required")

    const paitent = await Paitent.findOne({username}).lean();
    if(!paitent)
        return createResponse(res, false, 400, "Invalid Username")
    const checkPassword =  await bcrypt.compare(password, paitent?.password);
    if(!checkPassword)
        return createResponse(res, false, 400, "Invlaid Password");
    const { accessToken, refreshToken } = await getToken(paitent);
    res.cookie('jwt', refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge:7*24*60*60*1000
    })
    createResponse(res, true, 200, {accessToken, userId:paitent?._id, role:paitent?.role});
})

// export const refresh = asyncHandler( async (req, res)=>{
//     console.log("getting refresh token");
//     const cookies =  req.cookies;
//     if(!cookies.jwt) return createResponse(res, false, 401, "Unauthorized");

//     const refreshToken = cookies.jwt;
//     jwt.verify(
//         refreshToken,
//         process.env.JWT_REFRESH_KEY,
//         asyncHandler (async (err, decoded)=>{
//             if(err) return createResponse(res, 403, false, "Forbidden")
//             const user = await User.findOne({username:decoded.username}).lean();
//             if(!user) return createResponse(res, 401, false, "Unauthorized")
//             const { accessToken } = getToken(user);
            
//             createResponse(res, 200, true, { accessToken, userId:user?._id })
//         })
//     )
// })
const logout = asyncHandler ( async (req, res)=> {
    const cookies = req.cookies;
    if(!cookies?.jwt) return createResponse(res, false, 204, null);
    res.clearCookie('jwt', {secure:true, httpOnly:true, sameSite:'none'})
    createResponse(res, true, 200, "Cookie Cleared");
})

module.exports = {
    authDoctor,
    authPaitent,
    logout,
    authAdmin
}
