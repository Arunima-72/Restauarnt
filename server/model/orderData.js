const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    // name:{type:String},
     ref: "User",
      required: true 
    },
  items: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId,
      ref: 'Food' ,
      required: true
       },
     name:{type:String}  ,
     price:{type:Number,
     required:true}  ,
     quantity: { 
      type: Number, 
      required: true,

    default: 1}
  }],
  totalPrice: {
     type: Number, 
     required: true },

  status: { type: String,
     enum: ["pending","placed", "preparing", "ready","assigned","delivering", "delivered","cancelled"],
      default: "pending" },

  paymentStatus: {
     type: String, 
     enum: ["pending","paid","unpaid","failed"],
      default: "pending" },
  deliveryLocation: { 
    
    address:{ type:String ,required:true},
    lat:{type:Number,required:true},
    lng:{type:Number,required:true}
  
},
     phone:{type:String, required:true},
  paymentMethod: {
    type: String,
     enum: ["cash on delivery", "online payment"],
      default: "cash on delivery"},


  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  },
     
}, { timestamps: true

 });

module.exports = mongoose.model("Order", orderSchema);