const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
    {
        user_id: {type:Object}, //,required:true
        username: {type:String},
        train_id: {type:Object}, //,required:true
        train_number: {type:String},
        origin: {type:String}, //,required:true
        destination: {type:String}, //,required:true
        departureTime: {type:String},
        arrivalTime: {type:String},
        date: {type:Object},
        passenger: {type:Number,default:1}, //,required:true
        reservation_class: {type:Number, default:0},
        seat_reservation: [{
            coach: {type:Number, default:0},
            row: {type:Number, default:0},
            column: {type:String}
        }],
        food_reservation: {type:Array, default:[]},
        ticketPrice: {type:Number, default:0},
        reservation_price: {type:Number, default:0},
        food_price: {type:Number, default:0},
        total_price: {type:Number, default:0},
        timestamp: {type:Object}

    }
)

module.exports = mongoose.model("ticket",ticketSchema)