const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, minlength: 2},
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  roles: { type: [String], required: true, default: ["user"] },
});

module.exports = mongoose.model("User", userSchema);