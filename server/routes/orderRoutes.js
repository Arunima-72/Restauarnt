
const express = require("express");
const router = express.Router();
const Order = require("../model/orderData");
const User = require("../model/userData");
const { verifyToken, isAdmin, checkRole } = require("./jwt");

// ✅ 1. Create new order (user)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, deliveryLocation, phone, paymentStatus } = req.body;
    const userId = req.user.userId; // Use req.user.id as per your jwt.js

    const order = new Order({
      user: userId,
      items,
      totalPrice,
      paymentMethod,
      deliveryLocation,
      phone,
      paymentStatus: paymentMethod === "cash on delivery" ? "pending" : (paymentStatus || "paid"),
      status: paymentMethod === "cash on delivery" ? "placed" : "pending",
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// ✅ 2. Get all orders (Admin Only)
router.get("/",  async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone")
      .populate("items.foodItem","name quantity totalPrice")
      .populate("deliveryPerson", "name ");
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// ✅ 3. Get orders by user ID (User Order Page)
router.get("/user/:userId", verifyToken, checkRole('user'), async (req, res) => { 
  try {
    if (req.user.userId !== req.params.userId && req.user.role !== 'admin') { 
      return res.status(403).json({ message: "Access denied. You can only view your own orders." });
    }

    const orders = await Order.find({ user: req.params.userId })
      .populate("items.foodItem")
      .populate("deliveryPerson", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching user orders", error: err.message });
  }
});

// ✅ 4. Get orders assigned to a specific delivery person (Delivery Dashboard)
router.get('/delivery/:deliveryId', verifyToken, checkRole('delivery'), async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;
    if (req.user.id !== deliveryId) { // Use req.user.id for consistency
      return res.status(403).json({ message: "Access denied. You can only view your assigned orders." });
    }

    const orders = await Order.find({ deliveryPerson: deliveryId })
      .populate('user', 'name phone')
      .populate('items.foodItem');
    res.json(orders);
  } catch (error) {
    console.error("Error fetching assigned orders for delivery person:", error);
    res.status(500).json({ message: 'Failed to fetch assigned orders', error: error.message });
  }
});

// ✅ 5. Update order status (Admin & Delivery)
router.put("/:id/update-status", verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});
// router.put("/orders/:id", async (req, res) => { // Admin has full control
//   try {
//     const { status } = req.body;
//     const orderId = req.params.id;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.status = status;
//     await order.save();
//     res.json(order);
//   } catch (err) {
//     console.error("Error updating order status:", err);
//     res.status(500).json({ message: "Error updating order status", error: err.message });
//   }
// });

// ✅ 6. Admin assigns a delivery person to an order
// PUT /orders/:id/assign
router.put('/:id/assign', async (req, res) => {
  const { deliveryId } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryPerson: deliveryId,
        status: 'assigned'
      },
      { new: true }
    ).populate('deliveryPerson', 'name');
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error assigning delivery' });
  }
});
router.put('/orders/:id', async (req, res) => {
  const { status } = req.body;
  const userId = req.user.userId;

  const order = await Order.findById(req.params.userId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.deliveryPerson?.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  order.status = status;
  await order.save();
  res.json({ message: 'Status updated' });
});

// router.put('/orders/:id/assign', verifyToken, isAdmin, async (req, res) => {
//   try {
//     const { deliveryPersonId } = req.body;
//     const orderId = req.params.orderId;

//     const updatedOrder = await Order.findByIdAndUpdate(orderId, {
//       deliveryPerson: deliveryPersonId,
//       status: 'assigned'
//     }, { new: true })
//     .populate('user', 'name email')
//     .populate('deliveryPerson', 'name email');

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ message: 'Delivery person assigned', order: updatedOrder });
//   } catch (err) {
//     console.error("Error assigning delivery person:", err);
//     res.status(500).json({ message: 'Error assigning delivery person', error: err.message });
//   }
// });

// ✅ 7. Mark order as delivered (can free delivery partner) - Used by delivery person
// router.put("/:id/mark-delivered", verifyToken, checkRole('delivery'), async (req, res) => { // Changed to checkRole('delivery')
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (req.user.id !== order.deliveryPerson?.toString()) { // Use req.user.id
//         return res.status(403).json({ message: "Access denied. You can only mark your assigned orders as delivered." });
//     }

//     order.status = "delivered";
//     order.paymentStatus = "paid";
//     await order.save();

//     if (order.deliveryPerson) {
//       await User.findByIdAndUpdate(order.deliveryPerson, { isAvailable: true });
//     }

//     res.json(order);
//   } catch (err) {
//     console.error("Error marking order as delivered:", err);
//     res.status(500).json({ message: "Error marking order as delivered", error: err.message });
//   }
// });
router.put('/:id/update-status-delivery', verifyToken, checkRole('delivery'), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.deliveryPerson?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update status of your assigned orders' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating delivery status:', err);
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

router.put('/user/availability',verifyToken,async (req, res) => {
  const userId = req.user.userId; // from JWT
  const { available } = req.body;
  const user = await User.findByIdAndUpdate(userId, { available }, { new: true });
  res.json(user);
});

module.exports = router;