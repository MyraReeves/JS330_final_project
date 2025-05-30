const Comment = require("../models/commentsModel");
const User = require("../models/userModel");
const Park = require("../models/parkModel");


///////////////////////////
// CREATE a new comment //
///////////////////////////
async function createComment(data) {
    const comment = new Comment(data);
    return await comment.save();
}


/////////////////////////////////////////
// GET all comments for a given state //
/////////////////////////////////////////
async function getCommentsByState(state) {
    return await Comment.find({ state: state.toUpperCase() })
    .populate("userId", "username")
    .populate("parkId", "parkName");
}


///////////////////////////////////////////
// GET all comments for a specific park //
///////////////////////////////////////////
async function getCommentsByParkName(parkName) {
    const park = await Park.findOne({ parkName: new RegExp(`^${parkName}$`, "i") });    // This RegEx makes the search be case-insensitive
    
    if (!park) return null;

    return await Comment.find({ parkId: park._id })
    .populate("userId", "username")
    .populate("parkId", "parkName");
};


//////////////////////////////////////////////////////
// READ all comments made by a specified username  //
////////////////////////////////////////////////////
async function getCommentsByUsername(username) {
    const user = await User.findOne({ username: new RegExp(`^${username}$`, "i") });        // This RegEx makes the search be case-insensitive

    if (!user) return null;

    return await Comment.find({ userId: user._id })
    .populate("userId", "username")
    .populate("parkId", "parkName");
};


/////////////////////////////////////
// UPDATE a comment - Admin only  //
///////////////////////////////////
async function updateComment(commentId, updates) {
    return await Comment.findByIdAndUpdate(commentId, updates, {new: true,});
};


/////////////////////////////////////
// DELETE a comment - Admin only  //
///////////////////////////////////
async function deleteComment(commentId) {
    return await Comment.findByIdAndDelete(commentId);
};


module.exports = {
    createComment,
    getCommentsByState,
    getCommentsByParkName,
    getCommentsByUsername,
    updateComment,
    deleteComment,
};