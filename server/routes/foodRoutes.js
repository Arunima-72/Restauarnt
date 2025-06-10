

const express = require('express');
const router = express.Router();
const FoodItem = require('../model/foodData');

// Add new food item
router.post('/additems', async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all food items
router.get('/', async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update food item
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /fooditems/:id/toggle-status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isActive = !item.isActive; // Toggle
    await item.save();

    res.json({ message: `Item ${item.isActive ? 'activated' : 'deactivated'}`, item });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling item status', error: err.message });
  }
});

// Delete food item
router.delete('/delete/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/menu', async (req, res) => {
  try {
    const activeItems = await FoodItem.find({ isActive: true });
    res.json(activeItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: err.message });
  }
});
module.exports = router;
