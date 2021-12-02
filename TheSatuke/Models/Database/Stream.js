const mongoose = require("mongoose");

const stream = mongoose.Schema({
    userID: String,
    time: Number,
});

module.exports = mongoose.model("Stream", stream);