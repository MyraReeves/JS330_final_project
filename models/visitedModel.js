const mongoose = require("mongoose");

const visitedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // References the user's unique DB id
    ref: "User",                              // Connects to the User model
    required: true,                           // UserId is required
  },

  parkName: {
    type: String,
    required: true,
    trim: true,
  },

  state: {
    type: String,
    required: true,
    enum: ["WA", "OR"],
  },

  parkType: {
    type: String,
    required: true,
    enum: ["NP", "NHS", "NHR", "NHP", "NRA", "NVM"],
  },

  parks: {
    type: [
      { type: mongoose.Schema.Types.ObjectId,     // Creates an array using the park ids
      ref: "Park" }                               // Connects to the park model
    ],
    required: true,
    validate: v => v.length > 0                   // Ensures that the array is not empty
  },
});


module.exports = mongoose.model("Visited", visitedSchema);