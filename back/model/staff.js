const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
    firstname: { type: String, default: null},
    lastname: { type: String, default: null},
    email: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String },
    token: { type: String },
})

module.exports = mongoose.model('staff', staffSchema);