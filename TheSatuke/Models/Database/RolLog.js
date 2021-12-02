const mongoose = require("mongoose");

module.exports = mongoose.model("rollog", new mongoose.Schema({
    user: String, 
    roller: Array
}));