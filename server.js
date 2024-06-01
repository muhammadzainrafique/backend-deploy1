const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
const { getConnection } = require("./config/conn");
const app = express();
const PORT = process.env.PORT || 5000
getConnection();
app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'http://192.168.15.120:5173'];
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  
  app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/paitent", require("./routes/paitentRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/doctor", require("./routes/doctorRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/appointment", require("./routes/appointmentRoutes"));

app.use(errorHandler)

mongoose.connection.once("open", ()=>{
    console.log("Data base is connected")
})

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})