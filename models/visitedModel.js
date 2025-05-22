const mongoose = require("mongoose");

const visitedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,     // References the user's unique DB id
    ref: "User",                              // Connects to the User model
    required: true,                           // UserId is required
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





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// For now, I am only setting up the ability for a user to create one simple, compact list.                             //
// It is limited to being one document without containing any metadata like the date they visited, comments, etc.      //
//                                                                                                                    //
// In the future, if this needs to be converted instead into a format of keeping a document PER visit,               //
// (which will allow filtering by user, park, state, and type)                                                      //
// so that per-visit details can be tracked and statistics can be graphed, then the schema should be changed to:   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*

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
});


*/