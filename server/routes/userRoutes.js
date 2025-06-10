
const express = require('express');
const router = express.Router();
const User = require('../model/userData');
const { verifyToken, checkRole, isAdmin } = require('./jwt'); // Correct path to jwt.js

// ✅ 1. Get all users (Admin Only, optionally filtered by role)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};
    if (role) {
      filter.role = role;
    }
    // Select only necessary fields and exclude password
    const users = await User.find(filter).select('name email role available'); 
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// 2. Get single user by ID
// This route can be accessed by the user themselves (to get their own profile) or by an admin.
router.get('/:id', verifyToken, async (req, res) => { // :id matches req.params.id
  try {
    // Only allow user to fetch their own ID, or an admin to fetch any ID
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: You can only view your own profile.' });
    }

    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});


router.get('/:id/availability', verifyToken, checkRole('delivery'), async (req, res) => { 
  try {
    // Ensure the ID in the URL matches the authenticated user's ID
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Access denied: You can only view your own availability.' });
    }
    const user = await User.findById(req.user.id).select('available'); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ available: user.available });
  } catch (err) {
    console.error("Error fetching user availability:", err);
    res.status(500).json({ message: 'Error fetching availability', error: err.message });
  }
});


router.put('/availability', verifyToken, checkRole('delivery'), async (req, res) => { // Added middleware
  try {
    const { available } = req.body; // Expecting 'available' in req.body
    const userId = req.params.id; // User ID from URL

    // Ensure delivery person can only update their own availability
    if (req.user.user !== userId) {
        return res.status(403).json({ message: 'Access denied: You can only update your own availability.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {  available }, // 
      { new: true }
    ).select('-password'); // Exclude password

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user availability:", err);
    res.status(500).json({ message: 'Error updating availability', error: err.message });
  }
});


module.exports = router;