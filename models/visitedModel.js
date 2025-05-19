const mongoose = require("mongoose");

const visitedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // Refer to the user who placed the order
    ref: "User",                              // Refer to the User model
    required: true,                           // UserId is required
  },

  parks: {
    type: [
      { type: mongoose.Schema.Types.ObjectId,     // Creates an array using the park ids
      ref: "Park" }                               // Refers to the park model
    ],
    required: true,                               // ParkId is required
    validate: v => v.length > 0                   // Ensures that the array is not empty
  },
});


module.exports = mongoose.model("Visited", visitedSchema);