const bcrypt = require("bcrypt")

const createResponse = (res, success, status, Message)=>{
    return res.status(status).json({
        success,
        Message
    })
}

const bcryptPassword = async (password)=>{
    const salts = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salts);
    return hashedPassword;
}

module.exports = {
    createResponse,
    bcryptPassword
}