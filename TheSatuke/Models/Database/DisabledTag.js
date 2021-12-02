const mongoose = require("mongoose");

module.exports = mongoose.model("Disabled_Tag", new mongoose.Schema({
    guild: String,
  taglar: Array
}));