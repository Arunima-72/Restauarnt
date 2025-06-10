const mongoose = require('mongoose');

require('dotenv').config(mongoose.connection)
// connecting db
mongoose.connect('mongodb+srv://Arunima:Arunima72@cluster0.dwfhkqr.mongodb.net/RestaurantDb?retryWrites=true&w=majority&appName=Cluster0')
    // 'process.env.MONGODB_URL')
    .then(()=>{
    console.log('Connection established')
}).catch(()=>{
console.log('connection error')
})