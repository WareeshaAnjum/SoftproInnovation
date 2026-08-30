const express= require('express')
const routes= express.Router();
const Userdb = require('../models/user');

routes.post("/register" , async (req, res)=>{
try{
    const{email, name, password, status, mobile,gender}= req.body;
    const a= await Userdb.findOne({email});
    if(a){
        return res.json({msg: "email Already Exist"})
    }
    const data= await new Userdb({
        email:email,
        name:name,
        password: password,
        status:status,
        mobile: mobile,
        gender: gender

    });
   await data.save();
    return res.json({"msg":"email Resgistered"})
}catch(er){
    return res.json({"msg":"Server error"})
}
})

routes.get("/show" , async (req, res)=>{
   try {
     const data= await Userdb.find({})
    res.json({"msg":"User data", "data":data})
   } catch (error) {
    res.json({"msg":"data does not exist"})
   }
})

routes.patch("/:id" , async (req, res)=>{
    const{name, email, password, status, gender, mobile}= req.body
    const data= await Userdb.findByIdAndUpdate(req.params.id,{
        name: name,
        mobile: mobile,
        password: password,
        email:email,
        status:status,
        gender: gender

    });
    res.json("User data updated")
})

routes.delete('/:id', async (req, res)=>{
    const data= await Userdb.find();
    res.json(data)
    
})
module.exports= routes;