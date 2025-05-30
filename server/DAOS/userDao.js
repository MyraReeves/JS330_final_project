// Import the model:
const User = require("../models/userModel");

////////////////////////
// CREATE a new user //
//////////////////////
async function createUser(data) {
    const user = new User(data);
    return await user.save();
}

////////////////////////////////
// READ/Find a user by email //
//////////////////////////////
async function findUserByEmail(email) {
    return await User.findOne({ email }).select("+password");   // Adds password during login verification
}

/////////////////////////////
// READ/Find a user by ID //
///////////////////////////
async function findUserById(id) {
    return await User.findById(id).select("-password");    // It excludes showing their password for obvious security reasons
}

///////////////////////////////////
// READ/Find a user by Username //
/////////////////////////////////
async function findUserByUsername(username) {
    return await User.findOne({ username }).select("-password");        // It excludes showing their password for obvious security reasons
}

//////////////////////////////////////////////////////
// UPDATE a user's account info (such as password) //
////////////////////////////////////////////////////
async function updateUser(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
}

///////////////////////////////////
// DELETE a user using their ID //
/////////////////////////////////
async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}
  
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByUsername,
    updateUser,
    deleteUser
};