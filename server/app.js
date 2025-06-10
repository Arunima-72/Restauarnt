
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db/connection');

const foodroute=require('./routes/foodRoutes')
const userroute=require('./routes/userRoutes')
const orderroute=require('./routes/orderRoutes')
const reservationroute=require('./routes/reservationRoutes')
const authroute=require('./routes/authRoutes')
const slotroute=require('./routes/slotRoutes')
const paymentroute=require('./routes/paymentRoutes')



const app=new express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user',authroute);
app.use('/menu',foodroute);
app.use('/users',userroute);
app.use('/orders',orderroute);
app.use('/reservations',reservationroute);
app.use('/fooditems',foodroute);
app.use('/slots',slotroute);
app.use('/payment',paymentroute)
// const PORT = process.env.PORT || 3000;
app.listen(3000,() => {
    console.log(`Server running on port 3000`);
});