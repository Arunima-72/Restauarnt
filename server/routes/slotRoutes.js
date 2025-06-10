const express = require('express');

const router = express.Router();
const Slot = require('../model/slotData');
const { verifyToken, isAdmin } = require("../routes/jwt");
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { date, time, availableSeats } = req.body;

    const newSlot = new Slot({ date, time, availableSeats });
    const savedSlot = await newSlot.save();

    res.status(201).json({ message: "Slot created", slot: savedSlot });
  } catch (err) {
    res.status(400).json({ error: "Failed to create slot" });
  }
});
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { date, time, availableSeats } = req.body;

    const updatedSlot = await Slot.findByIdAndUpdate(
      req.params.id,
      { date, time, availableSeats },
      { new: true }
    );

    res.json({ message: "Slot updated", slot: updatedSlot });
  } catch (err) {
    res.status(400).json({ error: "Failed to update slot" });
  }
});
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete slot" });
  }
});
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});


module.exports = router;