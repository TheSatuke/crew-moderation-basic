const mongoose = require("mongoose");

module.exports = mongoose.model("Nots", new mongoose.Schema({
    user: { type: String }, 
    notlar: {type: Array }
}));