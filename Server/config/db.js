const mongoose= require('mongoose')
// const dotenv = require('dotenv')
// dotenv.config();
const mongoDb=()=>{
     mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("database is connected");
        
    }).catch(()=>{
        console.log("database is not connected");
        
    })
}
    module.exports= mongoDb;