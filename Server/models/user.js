const mongoose= require('mongoose')

const userSchema= mongoose.Schema({
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
    mobile:{
        type:String,
        required:true
    },
     status:{
        type:String,
        enum:['active', 'inactive', 'delete'],
        default:'active'
    },
     picture:{
        type:String,
    },
     gender:{
        type:String,
        required:true
    }
   
}, {
    timestamps:true
});

module.exports = mongoose.model("User", userSchema)