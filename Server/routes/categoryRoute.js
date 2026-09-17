const express= require('express')
const routes= express.Router();
const multer = require("multer");
const Category = require("../models/Category");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});


const upload = multer({
    storage: storage
});

// Create Category (supports both POST / and POST /register)
routes.post(
    ["/", "/register"],
    upload.single("photo"),
    async (req, res) => {
        try {
            const {
                category,
                description,
                status
            } = req.body;

            // Check image
            if (!req.file) {
                return res.status(400).json({
                    msg: "Please upload an image"
                });
            }

            // Create category
            const data = new Category({
                category: category,
                description: description,
                status: status || "Active",
                photo: req.file.filename
            });

            await data.save();

            return res.json({
                msg: "Category Registered",
                data: data
            });

        } catch (er) {
            console.log(er);
            return res.status(500).json({
                msg: "Server error",
                error: er.message
            });
        }
    }
);

// Get all categories (supports both GET / and GET /show)
routes.get(["/", "/show"], async (req, res) => {
    try {
        const data = await Category.find({}).sort({ createdAt: -1 });

        res.json({
            msg: "Category data",
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Failed to fetch categories",
            error: error.message
        });
    }
});

// Update category (supports PATCH /:id and PUT /:id with optional photo)
const handleUpdateCategory = async (req, res) => {
    try {
        const { category, description, status } = req.body;
        const updateData = {};

        if (category !== undefined) updateData.category = category;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (req.file) {
            updateData.photo = req.file.filename;
        }

        const data = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                msg: "Category not found"
            });
        }

        res.json({
            msg: "Category data updated",
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};

routes.patch("/:id", upload.single("photo"), handleUpdateCategory);
routes.put("/:id", upload.single("photo"), handleUpdateCategory);

// Delete category
routes.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Category.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                msg: "Category not found"
            });
        }

        res.json({
            msg: "Category deleted successfully",
            data: data
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
});
module.exports= routes;