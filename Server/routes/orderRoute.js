const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Server error fetching orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount,
      payment_method,
      shipping_address,
    } = req.body;

    const orderId = `SPI-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = new Order({
      order_id: orderId,
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount,
      payment_method: payment_method || 'Online Payment',
      shipping_address,
      status: 'Processing',
    });

    const saved = await newOrder.save();
    res.status(201).json({ msg: 'Order created successfully', data: saved });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Server error creating order' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json({ msg: 'Status updated', data: order });
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating status' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting order' });
  }
});

module.exports = router;
