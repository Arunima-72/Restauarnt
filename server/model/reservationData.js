const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true
    },
    
    date: {
        type: Date,
        required: true
      },
        time: {
        type: String,
        required: true

    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    
    specialRequests: {
        type: String
    },
status: {
     type: String,
      enum: [ "confirmed", "pending","cancelled"],
       default: "confirmed" },
},
{
    timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;