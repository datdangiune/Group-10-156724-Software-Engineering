const jwt = require('jsonwebtoken')
const genAccessToken = (id, role, fullname, email) => jwt.sign(
    {_id: id, role, fullname: fullname, email: email},
    process.env.JWT_SECRET,
    {
       expiresIn: "3d"
   }
)

const genRefreshToken = (id) => jwt.sign(
    {_id: id},
    process.env.JWT_SECRET,
    {
        expiresIn: "10d"
    }
)
module.exports = {
    genAccessToken,
    genRefreshToken
}