const mongoose = require("mongoose");

module.exports = mongoose.model("ToplUnBan", new mongoose.Schema({
    user: { type: String }, 
    mod: {type: String},
    sebep: {type: String}
}));