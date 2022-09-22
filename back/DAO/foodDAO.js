const Foodmodel = require('../model/food.js')
const mongoose = require('mongoose')

class Food{
    static async add(req,res){
        try{
            const { name,thai_name,description,thai_description,price} = req.body
            const userDoc = await Foodmodel.create({
                name,
                thai_name,
                description,
                thai_description,
                price
            })

            res.json(userDoc)
        }catch(err){
            console.log(err)
            res.send("Error")
        }
        
    }

    static async showAllFood(req,res){
        try{
            const allFood = await Foodmodel.find()
            res.json(allFood)
        }catch(err){
            console.log(err)
            res.send("Error in show")
        }
    }

    static async updatePrice(req,res){
        try{
            const foodID = mongoose.Types.ObjectId(req.body.food_id)
            const updatedFood = await Foodmodel.findByIdAndUpdate(foodID,{ $push: req.body.new_price})

            res.send(updatedFood)
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = Food