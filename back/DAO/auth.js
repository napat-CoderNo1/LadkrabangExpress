
const jsonwebtoken = require("jsonwebtoken");

class Auth{
    static verifyTokenGetUserID(token) {
    try {
      const decoded = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
      return decoded.user_id;
    } catch (err) {
      return false;
    }
  }
}

module.exports = Auth