const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  time: {
    type: String, // Format: "18:00"
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 5, // Change this if you have more/less tables
  },
});

slotSchema.index({ date: 1, time: 1 }, { unique: true }); // Prevent duplicate slots

module.exports = mongoose.model("Slot", slotSchema);
// This model defines the structure for reservation slots in the database.
// Each slot has a date, time, and the number of available tables.