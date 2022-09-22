const mongoose = require("mongoose")
const MONGO_URL = process.env.dbURL
exports.connect = () =>{
    mongoose.connect(MONGO_URL, {
        
    }).then(()=>{
        console.log("Sucess connect to database")
    }).catch((err) =>{
        console.log(err)
    })
}