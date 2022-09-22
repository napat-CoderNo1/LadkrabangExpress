const jsonwebtoken = require('jsonwebtoken')
const { modelName } = require('../model/user')

const config = process.env

const verifyToken = (req, res, next)=>{
    const token = req.body.token || req.query.token

    if(!token){
        return res.status(403).send("Require token")
    }

    try{
        const decoded = jsonwebtoken.verify(token, config.TOKEN_KEY)
        console.log(decoded)
        req.user = decoded
    }catch(err){
        return res.status(401).send("Invalid Token")
    }

    return next()
}

module.exports = verifyToken