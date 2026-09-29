const mongoose= require('mongoose')

const adminSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },  
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetCode:{
        type:String,
        default:null
    },
    resetCodeExpires:{
        type:Date,
        default:null
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Admin", adminSchema)