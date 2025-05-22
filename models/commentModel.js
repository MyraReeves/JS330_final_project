const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // Refer to the user who wrote the comment
    ref: "User",                              // Refer to the User model
    required: true,                           // UserId is required
  },

  parkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Park",
    required: true,
    },

  state: {
    type: String,
    enum: ["WA", "OR"],
    required: true,
  },

  visitDate: {
    type: Date,
    required: true,
  },

  weather: {
    type: String,
    trim: true,
  },

  tripSummary: {
    type: String,
    trim: true,
    required: true,
  },

  additionalNotes: {
    type: String,
    trim: true,
  },

  favoriteMoment: {
    type: String,
    trim: true,
  },

  memorableSights: {
    type: String,
    trim: true,
  },

  helpfulTips: {
    type: String,
    trim: true,
  }

}, { timestamps: true }     // Logs "createdAt" and "updatedAt" timestamps
);



module.exports = mongoose.model("Comment", commentsSchema);