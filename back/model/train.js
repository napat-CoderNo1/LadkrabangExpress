const mongoose = require('mongoose')

const trainSchema = new mongoose.Schema({
    train_number : String,
    train_name : {type:String, default:null},
    stand_ticket_available: {type:Boolean, default:true},
    service_date: {type:Object, default:null},
    service_day: [], //0=sunday -> 6=saturday
    class_in_train: {
        class_1: {
            class_available: {type:Boolean, default:true},
            remain_seat: {type:Number, default: 0}
        },
        class_2: {
            class_available: {type:Boolean, default:true},
            remain_seat: {type:Number, default: 0}
        },
        class_3: {
            class_available: {type:Boolean, default:true},
            remain_seat: {type:Number, default: 0}
        },
    },
    station:[{
        station_name: String,
        departure_hour: Number,
        departure_minute: Number
    }]
    

})

module.exports = mongoose.model("train",trainSchema)
