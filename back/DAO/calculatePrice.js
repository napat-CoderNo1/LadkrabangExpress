const Foodmodel = require('../model/food.js')
const mongoose = require('mongoose')

async function calculate(req,res){
    console.log(req.body)
    const { ticket_price , reserve_seat_price , food_id} = req.body
    let total = 0

    for (let i in food_price){
        thatFood = Foodmodel.findById(food_price[i])
        total += thatFood.price
    }
    total += ticket_price + reserve_seat_price
    res.send(`Nice ${total}`)
}

// export default calculate
module.exports = calculate
