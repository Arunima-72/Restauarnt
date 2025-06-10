
const express = require("express");
const router = express.Router();
const Reservation = require("../model/reservationData");
const { verifyToken, isAdmin, checkRole } = require("../routes/jwt");
const Slot = require("../model/slotData");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, time, numberOfGuests, specialRequests } = req.body;

    // Step 1: Find the slot
    const slot = await Slot.findOne({ date, time });

    if (!slot || slot.availableSeats<= 0) {
      return res.status(400).json({ message: "Selected slot is not available." });
    }

    
    // if (slot.availableSeats <= 0) {
    //   return res.status(400).json({ message: "No tables available for the selected slot." });
    // }

    // Step 2: Create reservation with "Confirmed" status
    const newReservation = new Reservation({
      user: req.user.userId,
      date,
      time,
      numberOfGuests,
      specialRequests,
      status: "confirmed", 
    });

    await newReservation.save();

    // Step 3: Decrement the slot's available tables
    slot.availableSeats -= 1;
    await slot.save();

    res.status(201).json({
      message: "Reservation successful",
      reservation: newReservation,
      status: newReservation.status,
      reservationId: newReservation._id,
    });
  } catch (err) {
    console.error("Error saving reservation:", err);
    res.status(500).json({ message: "Failed to save reservation" });
  }
});
router.get("/available-dates", async (req, res) => {
  try {
    const slots = await Slot.find({ availableSeats: { $gt: 0 } }).distinct("date");
    res.json({ dates: slots }); // 
  } catch (err) {
    res.status(500).json({ message: "Error fetching available dates" });
  }
});


router.get("/",verifyToken,isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("user", "name email");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/my", verifyToken, async (req, res) => {
  try {
    const myReservations = await Reservation.find({ user: req.user.userId });
    res.json(myReservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your reservations" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/check-availability", async (req, res) => {
  try {
    const { date, time } = req.body;

    const count = await Reservation.countDocuments({ date, time });

    const isAvailable = count < 5;

    res.json({ availableSeats: isAvailable });
  } catch (err) {
    console.error("Availability check error:", err);
    res.status(500).json({ message: "Server error while checking availability" });
  }
});


router.get("/available-times", async (req, res) => {
  const { date } = req.query;

  try {
    const slots = await Slot.find({ date, availableSeats: { $gt: 0 } }).sort({time:1});

    const availableSlots = slots.map((slot) => slot.time);

    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots" });
  }
});


router.put("/:id/cancel",verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    // Update reservation status
    reservation.status = "cancelled";
    await reservation.save();

    // Increment available tables
    const slot = await Slot.findOne({ date: reservation.date, time: reservation.time });
    if (slot) {
      slot.availableTables += 1;
      await slot.save();
    }

    res.json({ message: "Reservation cancelled", reservation });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
});

module.exports = router;
