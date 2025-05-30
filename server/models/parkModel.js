const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  parkName: { type: String, required: true, trim: true, unique: true, },
  state: { type: String, required: true, enum: ["WA", "OR"],},    // The database is currently limited to only Washington or Oregon parks
  parkType: { type: String, required: true, enum: ["NP", "NHS", "NHR", "NHP", "NRA", "NVM"],},   // National Park, National Historic Site, National Historical Reserve, National Historical Park, National Recreation Area, or National Volcanic Monument
  description: { type: String, required: true, trim: true,},
  websiteURL: { type: String, required: true, trim: true, default: "https://www.nps.gov/index.htm",},
  visitorCenterHours: {type: String, trim: true,},    //*** TO-DO:  Add a default message here in case no hours are known??? ***
  streetAddress: {type: String, required: true, trim: true,},
  city: {type: String, required: true, trim: true,},
  zipcode: {type: String, required: true, trim: true, minlength: 5, maxlength: 10,},
  phone: {type: String, required: true, trim: true, maxlength: 12,},
  googleMaps: {type: String, required: true, trim: true, default: "https://maps.app.goo.gl/"},
  // TO-DO:  Consider adding (location) as a geospatial mapping field

});


module.exports = mongoose.model("Park", parkSchema);