const mongoose = require('mongoose');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
         required: true,
        
         },
    password: { 
        type: String,
         required: true },
    email:    { 
        type: String,
         required: true, 
         unique: true,
        lowercase: true},
    role:     {
         type: String, 
         enum: ['user', 'admin','delivery'],
          default: 'user'
         },
       available: {
    type: Boolean,
    default: true,  
},
resetToken: {type:String},
  resetTokenExpiry:{type: Date},
},

    {timestamps: true });
    


module.exports = mongoose.model('User', userSchema);