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

// 3. Register route
routes.post(
    "/register",
    upload.single("photo"),
    async (req, res) => {

        console.log("hello");

        try {
            console.log("Body:", req.body);
            console.log("File:", req.file);

            const {
                category,
                description,
                status
            } = req.body;

            // Check category already exists
            // const a = await Category.findOne({ category });

            // if (a) {
            //     return res.json({
            //         msg: "Category Already Exist"
            //     });
            // }

            // Check image
            if (!req.file) {
                return res.json({
                    msg: "Please upload an image"
                });
            }

            // Create category
            const data = new Category({
                category: category,
                description: description,
                status: status,
                photo: req.file.filename
            });

            await data.save();

            return res.json({
                msg: "Category Registered"
            });

        } catch (er) {

            console.log(er);

            return res.status(500).json({
                msg: "Server error"
            });
        }
    }
);

routes.get("/show", async (req, res) => {
    try {

        const data = await Category.find({});

        res.json({
            msg: "Category data",
            data: data
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            msg: "data does not exist"
        });
    }
});

routes.patch("/:id" , async (req, res)=>{
    const{category, description, status}= req.body
    const data= await Category.findByIdAndUpdate(req.params.id,{
       category:category, 
       description:description, 
       status: status
    });
    res.json("Category data updated")
})

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
            msg: "Server error"
        });
    }
});
module.exports= routes;