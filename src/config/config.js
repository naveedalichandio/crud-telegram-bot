const mongoose = require("mongoose");
const express = require("express");
const { startBot } = require("../helpers/InitializeBot");
require("dotenv").config();
var app = express(); // Init Express APP
var server = require("http").Server(app);

const port = process.env.PORT_NO || 8081;
server.listen(port, () => {
    console.log(`Server Running ON Port ${port}`);
});

// connecting with mongodb
let botPromise = new Promise(async (resolve) => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");

    let bot = await startBot();
    resolve(bot);
});

exports.getBot = () => botPromise;
