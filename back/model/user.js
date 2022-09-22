const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: { type: String, default: null},
    lastname: { type: String, default: null},
    email: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String },
    birthdate: { type: Object, default: null},
    token: { type: String },
    ticket: [],
})

module.exports = mongoose.model('user', userSchema);