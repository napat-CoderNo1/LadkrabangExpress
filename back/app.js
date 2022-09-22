const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const memberRouter = require('./router/memberRoute')
const auth = require('./middleware/auth')

dotenv.config()
require('./config/database.js').connect()

const app = express()
app.use(cors())
app.use(express.json())


app.use("/api", memberRouter)


app.post('/welcome', auth , (req,res)=>{
    res.status(200).send("Welcome")
})


module.exports = app