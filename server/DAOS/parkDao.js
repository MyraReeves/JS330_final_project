// Import the model:
const Park = require("../models/parkModel")


// ** NOTE:  Use of these functions is restricted to admins only! **


////////////////////////
// CREATE a new park //
//////////////////////
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

///////////////////////////////
// READ/Find parks by state //
/////////////////////////////
async function getParksByState(state) {
    return await Park.find({ state: state.toUpperCase() });
}

/////////////////////////////////
// READ/Find one park by name //
///////////////////////////////
async function getParkByName(parkName) {
    return await Park.findOne({ parkName });
}

///////////////////////////////
// READ/Find one park by ID //
/////////////////////////////
async function getParkById(id) {
    return await Park.findById(id);
}

///////////////////////////
// UPDATE a park's info //
/////////////////////////
async function updatePark(id, updates) {
    return await Park.findByIdAndUpdate(id, updates, { new: true });
}

////////////////////
// DELETE a park //
//////////////////
async function deletePark(id) {
    return await Park.findByIdAndDelete(id);
}


module.exports = {
    createPark,
    getAllParks,
    getParksByState,
    getParkByName,
    getParkById,
    updatePark,
    deletePark,
};