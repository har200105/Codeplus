const express = require('express');
const cors = require("cors");
const app = express();
const ErrorMiddleware = require("./errorHandlers/Error");
const nodeCron = require("node-cron");
const Stats = require("./models/Stats");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");


// getting config values
require("dotenv").config();

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// database connection
require("./db/db")();

// cronjob scheduler
nodeCron.schedule("0 0 0 1 * *", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});


const courseRoutes = require("./routers/courseRouter");
const userRoutes = require("./routers/userRouter");
const paymentRoutes = require("./routers/paymentRouter");
const superAdminRoutes = require("./routers/superAdminRouter");
const statsRoutes = require("./routers/statsRouter");

app.use("/api", courseRoutes);
app.use("/api", userRoutes);
app.use("/api", paymentRoutes);
app.use("/api", statsRoutes);
app.use("/api",superAdminRoutes);


app.use(ErrorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is Running');
});
