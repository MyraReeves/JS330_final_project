const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  parkName: { type: String, required: true, trim: true },
});


module.exports = mongoose.model("Park", parkSchema);