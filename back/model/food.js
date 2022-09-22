const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema(
    {
        name: String,
        thai_name: String,
        description: String,
        thai_description: String,
        price: Number
    }
)

module.exports = mongoose.model("food",foodSchema)