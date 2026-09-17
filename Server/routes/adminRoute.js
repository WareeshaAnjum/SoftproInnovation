const express = require('express');
const routes = express.Router();
const Admindb = require("../models/admin");
const jwt = require('jsonwebtoken');

// Admin Register
routes.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, msg: "Name, email, and password are required." });
        }
        
        const existing = await Admindb.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({ success: false, msg: "Admin email already exists." });
        }

        const data = new Admindb({
            email: email.toLowerCase().trim(),
            name: name.trim(),
            password: password
        });

        await data.save();
        return res.status(201).json({ success: true, msg: "Admin registered successfully", data });
    } catch (er) {
        console.error('Admin register error:', er);
        return res.status(500).json({ success: false, msg: "Server error" });
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
                return res.status(404).json({ success: false, msg: "Admin email not found in database." });
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