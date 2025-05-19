const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // Refer to the user who wrote the comment
    ref: "User",                              // Refer to the User model
    required: true,                           // UserId is required
  },

});


module.exports = mongoose.model("Comment", commentsSchema);