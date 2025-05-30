const Visited = require("../models/visitedModel");
const User = require("../models/userModel");


//////////////////////////////
// CREATE a "Visited" list //
////////////////////////////
async function createVisitedList(userId, initialParks = []) {
    const visited = new Visited({ userId, parks: initialParks });
    return await visited.save();
}


/////////////////////////////////////////////////////
// READ a user's "Visited" list by using their ID //
///////////////////////////////////////////////////
async function getVisitedByUserId(userId) {
    return await Visited.findOne({ userId })

    // Populate the array with user-friendly details such as the park name:
    .populate("parks", "parkName state parkType")
    .exec();
}


///////////////////////////////////////////////////////////
// READ a user's "Visited" list by using their username //
/////////////////////////////////////////////////////////
async function getVisitedByUsername(username) {
    const user = await User.findOne({ username });

    // Conditional in case the username that was entered doesn't exist:
    if (!user) return null;

    // Find a user's id via their username and then use that userId to send a resquest to the "Visited" list:
    return await Visited.findOne({ userId: user._id })

    // Populate the array with user-friendly details such as the park name:
    .populate("parks", "parkName state parkType")
    .exec();
}


//////////////////////////////////////////////////////////////////////////////////////////
// READ all visited parks of one specified type (example: NHS) that a user has visited //
////////////////////////////////////////////////////////////////////////////////////////
async function getVisitedByType(username, parkType) {
    const user = await User.findOne({ username });
    if (!user) return null;

    const visited = await Visited.findOne({ userId: user._id }).populate({
        path: "parks",
        match: { parkType },        // Filters by park type (NPS, NVM, etc.)
        select: "parkName state parkType",  // Selects which fields to show in the results
    });

    // Return the filtered list or an empty array if none match:
    return visited ? visited.parks : [];
}


/////////////////////////////////////////////////////////////////
// READ all of a user's visited parks for one specified state //
///////////////////////////////////////////////////////////////
async function getVisitedByState(username, state) {
    const user = await User.findOne({ username });
    if (!user) return null;

    const visited = await Visited.findOne({ userId: user._id }).populate({
        path: "parks",
        match: { state },   // Filters using the specified state
        select: "parkName state parkType",  // Specifies which fields to include when the results get returned
    });

    // Return the filtered list or an empty array if none match:
    return visited ? visited.parks : [];
}


///////////////////////////////////////////
// UPDATE - Add a park to a user's list //
/////////////////////////////////////////
async function addParkToVisited(userId, parkId) {
    return await Visited.findOneAndUpdate(
        { userId },
        { $addToSet: { parks: parkId } }, // Prevents duplicates
        { new: true }
    ).populate("parks", "parkName state parkType");
}


///////////////////////////////////////
// DELETE a park from a user's list //
/////////////////////////////////////
async function removeParkFromVisited(userId, parkId) {
    return await Visited.findOneAndUpdate(
        { userId },
        { $pull: { parks: parkId } },
        { new: true }
    ).populate("parks", "parkName state parkType");
}


module.exports = {
    createVisitedList,
    getVisitedByUserId,
    getVisitedByUsername,
    getVisitedByType,
    getVisitedByState,
    addParkToVisited,
    removeParkFromVisited,
};