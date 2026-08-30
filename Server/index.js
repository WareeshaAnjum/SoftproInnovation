const express= require('express')
const cors= require('cors')
const dotenv= require('dotenv')
const mongoDb= require('./config/db')
const app= express();
app.use(express.json());

dotenv.config();
mongoDb();

app.use(cors());
app.use("/api/admin", require("./routes/adminRoute") )
app.use("/api/user", require("./routes/userRoute") )
app.use("/api/category", require("./routes/categoryRoute") )
app.listen(process.env.PORT, ()=>{
    console.log("Server is running");
    
})
