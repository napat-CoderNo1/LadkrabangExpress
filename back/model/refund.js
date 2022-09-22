const mongoose = require('mongoose')

const refundSchema = new mongoose.Schema({
    ticketID: {type:Object , required: true},
    userID: {type:Object , required: true},
    ticketInfo: {type:Object , required: true},
    reason: {type: String , required:true},
    timestamp: {type:Object}
})

module.exports = mongoose.model('refund', refundSchema);