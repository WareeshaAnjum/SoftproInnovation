const mongoose = require('mongoose')
const categorySchema= mongoose.Schema({
    category:{
        type:String,
        required:true
    },  
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    }
    },
    {
        timestamps:true
    });
    
    module.exports = mongoose.model("Category",categorySchema)