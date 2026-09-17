const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongoDb = require('./config/db');
const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

mongoDb();

app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/product", require("./routes/productRoute")); 
app.use("/api/order", require("./routes/orderRoute")); 

app.listen(process.env.PORT, ()=>{
    console.log("Server is running");
    
})
