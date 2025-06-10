const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    category:{ 
        type: String,
        enum: ['All', 'Italian', 'Desserts', 'Chinese', 'Indian','Arabian'],
        required: true},
    imageUrl: String,
    
    available: {
        type: Boolean,
        default: true
    }
    ,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
     isActive: {
    type: Boolean,
    default: true 
},},
 { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;