const  jwt = require('jsonwebtoken')
const getToken = (user)=>{
    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":user?.username,
                "name":user?.name,
                "email":user?.email
            },
        },
        process.env.JWT_SECRET_kEY,
         { expiresIn:"1m" }
    )
    const refreshToken = jwt.sign(
        {"username": user.username},
        process.env.JWT_REFRESH_KEY,
        { expiresIn:"7d"}
    )

    return { accessToken, refreshToken }
}

module.exports = {
    getToken
}