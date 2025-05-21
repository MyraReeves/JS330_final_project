// Import the model:
const Park = require("../models/parkModel")

////////////////////////
// CREATE a new park //
////////////////////////
async function createPark(data) {
  const park = new Park(data);
  return await park.save();
}

/////////////////////////
// READ/Get all parks //
///////////////////////
async function getAllParks() {
  return await Park.find();
}


module.exports = {
    createPark,
    getAllParks,
}