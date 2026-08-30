const express= require('express')
const routes= express.Router();

const Category = require('../models/Category');

routes.post("/register" , async (req, res)=>{
try{
    const{category, description, status}= req.body;
    const a= await Category.findOne({category});
    if(a){
        return res.json({msg: "Category Already Exist"})
    }
    const data= await new Category({
        category:category,
        description: description,
        status:status
    });
    await data.save();
    return res.json({"msg":"Category Resgistered"})
}catch(er){
    return res.json({"msg":"Server error"})
}
})

routes.get("/show" , async (req, res)=>{
   try {
     const data= await Category.find({})
    res.json({"msg":"Category data", "data":data})

    
   } catch (error) {
    res.json({"msg":"data does not exist"})
   }
})

routes.patch("/:id" , async (req, res)=>{
    const{category, description, status}= req.body
    const data= await Category.findByIdAndUpdate(req.params.id,{
       category:category, 
       description:description, 
       status: status
    });
    res.json("Category data updated")
})

routes.delete('/:id', async (req, res)=>{
    const data= await Category.find();
    res.json(data)
    
})
module.exports= routes;