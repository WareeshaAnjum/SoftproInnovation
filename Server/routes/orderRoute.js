const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Helper to create email transporter
const createTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    // Fallback log transporter
    return {
        sendMail: async (mailOptions) => {
            console.log('--- EMAIL NOTIFICATION SENT (FALLBACK LOG) ---');
            console.log('To:', mailOptions.to);
            console.log('Subject:', mailOptions.subject);
            console.log('------------------------------------------------');
            return { messageId: 'simulated-' + Date.now() };
        }
    };
};

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

// Create new order & Send Payment Confirmation Email
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
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const newOrder = new Order({
      order_id: orderId,
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount,
      payment_method: payment_method || 'UPI Payment (9432414877@ibl)',
      shipping_address,
      status: 'Processing',
    });

    const saved = await newOrder.save();

    // Format items list for email
    const itemListHtml = (items || [])
      .map(
        (i) =>
          `<tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px; font-weight: 600;">${i.name || 'Component'}</td>
            <td style="padding: 8px; text-align: center;">${i.quantity || 1}</td>
            <td style="padding: 8px; text-align: right; color: #c2410c; font-weight: 700;">₹${Number(i.price || 0).toLocaleString('en-IN')}</td>
          </tr>`
      )
      .join('');

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; letter-spacing: 1px;">SoftPro Innovation</h2>
          <p style="margin: 6px 0 0 0; color: #f97316; font-weight: 600; font-size: 14px;">⚡ NEW PAYMENT & ORDER RECEIVED</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 13px; color: #78716c;">TRANSACTION ID:</span>
              <strong style="font-size: 16px; color: #0f172a;">${orderId}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 13px; color: #78716c;">TIMESTAMP:</span>
              <strong style="font-size: 13.5px; color: #0f172a;">${timestamp} IST</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 13px; color: #78716c;">TOTAL PAID:</span>
              <strong style="font-size: 20px; color: #c2410c;">₹${Number(total_amount).toLocaleString('en-IN')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 13px; color: #78716c;">PAYMENT METHOD:</span>
              <strong style="font-size: 13px; color: #16a34a;">${payment_method || 'UPI (9432414877@ibl)'}</strong>
            </div>
          </div>

          <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a;">Customer Details</h3>
          <p style="margin: 0 0 4px 0; font-size: 13.5px;"><strong>Name:</strong> ${customer_name || 'N/A'}</p>
          <p style="margin: 0 0 4px 0; font-size: 13.5px;"><strong>Email:</strong> ${customer_email || 'N/A'}</p>
          <p style="margin: 0 0 16px 0; font-size: 13.5px;"><strong>Mobile:</strong> ${customer_phone || 'N/A'}</p>

          <h3 style="font-size: 16px; margin: 16px 0 12px 0; color: #0f172a;">Ordered Products</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left; border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 8px;">Item Name</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemListHtml}
            </tbody>
          </table>

          <p style="font-size: 12.5px; color: #64748b; margin: 20px 0 0 0; text-align: center;">
            This is an automated notification from SoftPro Innovation Payment Gateway.
          </p>
        </div>
      </div>
    `;

    // Send Email to Admin (wareeshaanjum2004@gmail.com) and Customer
    try {
      const transporter = createTransporter();
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'wareeshaanjum2004@gmail.com';
      
      const recipients = [adminEmail];
      if (customer_email && customer_email.includes('@') && customer_email !== adminEmail) {
        recipients.push(customer_email);
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"SoftPro Innovation" <wareeshaanjum2004@gmail.com>',
        to: recipients.join(','),
        subject: `💳 Payment Successful: Txn #${orderId} - ₹${Number(total_amount).toLocaleString('en-IN')}`,
        html: emailHtml,
        text: `Payment Successful! Transaction ID: ${orderId} | Timestamp: ${timestamp} | Amount: ₹${total_amount} | Method: ${payment_method}`,
      });
      console.log(`Payment notification email sent for order ${orderId} to ${recipients.join(', ')}`);
    } catch (mailErr) {
      console.error('Failed to send payment email:', mailErr);
    }

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
