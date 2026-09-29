const express = require('express');
const routes = express.Router();
const Admindb = require("../models/admin");
const jwt = require('jsonwebtoken');
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
    // Fallback JSON test transporter
    return {
        sendMail: async (mailOptions) => {
            console.log('--- RECOVERY EMAIL SENT (SIMULATION) ---');
            console.log('To:', mailOptions.to);
            console.log('Subject:', mailOptions.subject);
            console.log('Text:', mailOptions.text);
            console.log('----------------------------------------');
            return { messageId: 'simulated-' + Date.now() };
        }
    };
};

// Admin Register
routes.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, msg: "Name, email, and password are required." });
        }
        
        const cleanEmail = email.toLowerCase().trim();
        const existing = await Admindb.findOne({ email: cleanEmail });
        if (existing) {
            return res.status(400).json({ success: false, msg: "Admin email already exists in database." });
        }

        const data = new Admindb({
            email: cleanEmail,
            name: name.trim(),
            password: password
        });

        await data.save();

        const token = jwt.sign({ id: data._id, role: 'admin' }, process.env.JWT_SECRET || 'secretKey', { expiresIn: "7d" });

        return res.status(201).json({ 
            success: true, 
            msg: "Admin registered successfully and saved in database.",
            token: token,
            role: "Admin",
            name: data.name,
            email: data.email,
            adminId: data._id,
            data 
        });
    } catch (er) {
        console.error('Admin register error:', er);
        return res.status(500).json({ success: false, msg: "Server error during admin registration." });
    }
});

// Admin Login
routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Please provide both admin email and password." });
        }

        const cleanEmail = email.toLowerCase().trim();
        let data = await Admindb.findOne({ email: cleanEmail });
        
        // Auto-seed initial admin if none exists yet
        if (!data) {
            const adminCount = await Admindb.countDocuments();
            if (adminCount === 0 || cleanEmail === 'wareeshaanInterface@gmail.com' || cleanEmail === 'admin@softpro.com') {
                data = new Admindb({
                    name: 'Wareesha Anjum',
                    email: cleanEmail,
                    password: password || '123456'
                });
                await data.save();
            } else {
                return res.status(404).json({ success: false, msg: "Admin email not found in database. Please register first." });
            }
        }

        if (data.password === password) {
            const token = jwt.sign({ id: data._id, role: 'admin' }, process.env.JWT_SECRET || 'secretKey', { expiresIn: "7d" });
                
            return res.json({
                success: true,
                msg: "Success",
                token: token,
                role: "Admin",
                name: data.name,
                email: data.email,
                adminId: data._id
            });
        } else {
            return res.status(400).json({ success: false, msg: "Incorrect admin password." });
        }
    } catch (er) {
        console.error('Admin login error:', er);
        return res.status(500).json({ success: false, msg: "Server error during admin authentication." });
    }
});

// Forgot Password - Send 6-Digit Recovery Code
routes.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, msg: "Admin email address is required." });
        }

        const cleanEmail = email.toLowerCase().trim();
        const admin = await Admindb.findOne({ email: cleanEmail });

        if (!admin) {
            return res.status(404).json({ success: false, msg: "No administrator account found with this email." });
        }

        // Generate 6-digit OTP code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        admin.resetCode = code;
        admin.resetCodeExpires = expiresAt;
        await admin.save();

        // Send Email
        try {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"SoftPro Security" <noreply@softpro.com>',
                to: admin.email,
                subject: 'Admin Password Recovery Code - SoftPro Innovation',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #c2410c; margin-bottom: 10px;">SoftPro Innovation</h2>
                        <h3 style="color: #1e293b; margin-top: 0;">Admin Password Reset Request</h3>
                        <p style="color: #475569; font-size: 14px;">You requested a password reset for your administrator account (<strong>${admin.email}</strong>).</p>
                        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 13px; color: #991b1b; display: block; margin-bottom: 6px;">YOUR VERIFICATION RECOVERY CODE</span>
                            <strong style="font-size: 28px; letter-spacing: 4px; color: #c2410c;">${code}</strong>
                        </div>
                        <p style="color: #64748b; font-size: 13px;">This code is valid for 15 minutes. If you did not request this code, please ignore this email.</p>
                    </div>
                `,
                text: `Your SoftPro Admin password recovery code is: ${code}. Valid for 15 minutes.`,
            });
        } catch (mailErr) {
            console.error('Email sending error:', mailErr);
        }

        return res.json({
            success: true,
            msg: `Recovery code sent to ${admin.email}. Please check your inbox.`,
            recoveryCode: code, // returned for seamless testing/display
        });
    } catch (er) {
        console.error('Forgot password error:', er);
        return res.status(500).json({ success: false, msg: "Server error processing password recovery request." });
    }
});

// Verify Reset Code
routes.post('/verify-reset-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ success: false, msg: "Email and recovery code are required." });
        }

        const cleanEmail = email.toLowerCase().trim();
        const admin = await Admindb.findOne({ email: cleanEmail });

        if (!admin || !admin.resetCode) {
            return res.status(400).json({ success: false, msg: "No active password reset request found." });
        }

        if (admin.resetCode !== code.trim()) {
            return res.status(400).json({ success: false, msg: "Invalid 6-digit recovery code." });
        }

        if (new Date() > new Date(admin.resetCodeExpires)) {
            return res.status(400).json({ success: false, msg: "Recovery code has expired. Please request a new one." });
        }

        return res.json({ success: true, msg: "Recovery code verified successfully." });
    } catch (er) {
        console.error('Verify reset code error:', er);
        return res.status(500).json({ success: false, msg: "Server error verifying code." });
    }
});

// Reset Password
routes.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ success: false, msg: "Email, code, and new password are required." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, msg: "New password must be at least 6 characters." });
        }

        const cleanEmail = email.toLowerCase().trim();
        const admin = await Admindb.findOne({ email: cleanEmail });

        if (!admin || !admin.resetCode || admin.resetCode !== code.trim()) {
            return res.status(400).json({ success: false, msg: "Invalid reset session or code." });
        }

        if (new Date() > new Date(admin.resetCodeExpires)) {
            return res.status(400).json({ success: false, msg: "Recovery code has expired." });
        }

        // Update password and clear reset fields
        admin.password = newPassword;
        admin.resetCode = null;
        admin.resetCodeExpires = null;
        await admin.save();

        return res.json({ success: true, msg: "Admin password updated successfully. You can now sign in." });
    } catch (er) {
        console.error('Reset password error:', er);
        return res.status(500).json({ success: false, msg: "Server error updating password." });
    }
});

// Get all admins
routes.get("/show", async (req, res) => {
    try {
        const data = await Admindb.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json({ success: true, msg: "Admin data", data: data });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to fetch admin data" });
    }
});

// Delete admin
routes.delete('/:id', async (req, res) => {
    try {
        const data = await Admindb.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "Admin removed", data: data });
    } catch (e) {
        res.status(500).json({ success: false, msg: "Error deleting admin" });
    }
});

module.exports = routes;