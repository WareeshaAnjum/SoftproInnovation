const express= require('express')
const routes= express.Router();
const Admindb=require("../models/admin")
const jwt = require('jsonwebtoken')

routes.post("/register" , async (req, res)=>{
try{
    const{email, password, name}= req.body;
    console.log(req.body);
    
    const a= await Admindb.findOne({email});
    if(a){
        return res.json({msg: "Email Already Exist"})
    }
    const data=await  new Admindb({
        email:email,
        name:name,
        password: password
    });
    data.save();
    return res.json({"msg":"Email Resgistered"})
}catch(er){
    return res.json({"msg":"Server error"})
}
})

routes.post('/login', async(req, res)=>{
    try{
        const {email, password}= req.body;
        const data= await Admindb.findOne({email:email});
        if(!data){
            return res.json({msg:"Email not Found"});
        }
        if(data.password==password){
            const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
                
            return res.json({
                msg:"Success",
                token:token,
                role:"admin",
                name: data.name,
                adminId: data._id
            })
        }else{
            return res.json({msg:"Password is Incorrect"})
        }
    }catch(er){
        console.log(er);
        return res.json({msg:"Server error"})
        
    }

})

routes.get("/show" , async (req, res)=>{
   try {
     const data= await Admindb.find()
    res.json({"msg":"Admin data", "data":data})

    
   } catch (error) {
    res.json({"msg":"data does not exist"})
   }
})

// routes.patch("/:id" , async (req, res)=>{
//     const{name, email, password}= req.body
//     const data= await Admindb.findByIdAndUpdate(req.params.id,{
//         name: name,
//         email:email,
//         password: password
//     });
//     res.json("Admin data updated")
// })

// routes.delete('/:id', async (req, res)=>{
//     const data= await Admindb.find();
//     res.json(data)
    
// })
module.exports= routes;