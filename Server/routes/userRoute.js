const express = require('express');
const routes = express.Router();
const Userdb = require('../models/user');
const jwt = require('jsonwebtoken');

// Register User
routes.post("/register", async (req, res) => {
    try {
        const { email, name, password, mobile, gender, status } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, msg: "Name, email, and password are required." });
        }

        const existing = await Userdb.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({ success: false, msg: "An account with this email already exists." });
        }

        const data = new Userdb({
            email: email.toLowerCase().trim(),
            name: name.trim(),
            password: password,
            status: status || 'active',
            mobile: mobile ? mobile.trim() : '',
            gender: gender || 'other'
        });

        await data.save();
        return res.status(201).json({
            success: true,
            msg: "Account registered successfully",
            data: {
                _id: data._id,
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                role: 'Customer',
                status: data.status,
                createdAt: data.createdAt
            }
        });
    } catch (er) {
        console.error('Register error:', er);
        return res.status(500).json({ success: false, msg: "Server error during registration." });
    }
});

// User Login
routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Please provide both email and password." });
        }

        const user = await Userdb.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ success: false, msg: "No user found with this email. Please register first." });
        }
        if (user.password !== password) {
            return res.status(400).json({ success: false, msg: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: "7d" });

        return res.json({
            success: true,
            msg: "Success",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                status: user.status,
                role: 'Customer',
                picture: user.picture
            }
        });
    } catch (er) {
        console.error('Login error:', er);
        return res.status(500).json({ success: false, msg: "Server error during login." });
    }
});

// Get all registered users
routes.get("/show", async (req, res) => {
    try {
        const data = await Userdb.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json({ success: true, msg: "User data", data: data });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to fetch users" });
    }
});

// Get single user profile
routes.get(["/profile/:id", "/:id"], async (req, res) => {
    try {
        const user = await Userdb.findById(req.params.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        res.json({ success: true, msg: "User found", data: user });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

// Update Profile
routes.patch(["/profile/:id", "/:id"], async (req, res) => {
    try {
        const { name, email, mobile, gender, status } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (gender !== undefined) updateData.gender = gender;
        if (status !== undefined) updateData.status = status;

        const data = await Userdb.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, select: "-password" }
        );

        if (!data) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        res.json({ success: true, msg: "User data updated", data: data });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to update user profile" });
    }
});

// Change Password
routes.post("/change-password/:id", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await Userdb.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        if (user.password !== currentPassword) {
            return res.status(400).json({ success: false, msg: "Current password does not match" });
        }

        user.password = newPassword;
        await user.save();
        res.json({ success: true, msg: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error changing password" });
    }
});

// Delete user
routes.delete('/:id', async (req, res) => {
    try {
        const data = await Userdb.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "User deleted", data: data });
    } catch (e) {
        res.status(500).json({ success: false, msg: "Error deleting user" });
    }
});

module.exports = routes;