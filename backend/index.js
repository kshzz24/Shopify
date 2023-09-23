const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const path = require('path')
const express = require('express');
// Handling uncaught exception

process.on("uncaughtException", (err) => {
  console.log(`'Error' + ${err.message}`);
  console.log("Shutting Down the Server due to  Uncaught Exception");
  process.exit(1);
});

//const connectDatabase = require('./config/database');

// config

// dotenv.config({ path: "backend/.env" });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/.env" });
}


mongoose.connect(process.env.DB_URL).then(function (db) {
  console.log("db is connected");
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log("backend is running");
});


const __dirname1 = path.resolve();
if(process.env.NODE_ENV==="production")
{
app.use(express.static(path.join(__dirname1, "/frontend/build")));


app.get("*", (req, res) => {
  
  res.sendFile(path.resolve(__dirname1, "/frontend/build/index.html"));
});
}

process.on("unhandledRejection", (err) => {
  console.log(`'Error' + ${err.message}`);
  console.log("Shutting Down the Server due to unhandled Promise Rejection");
  server.close(() => {
    process.exit();
  });
});
