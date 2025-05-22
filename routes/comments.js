const express = require("express");
const router = express.Router();
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const commentsDao = require("../DAOS/commentsDao");
const Park = require("../models/parkModel");


////////////////////////////////////////////////////////////////
// CREATE a new comment - Restricted to logged-in users only //
//////////////////////////////////////////////////////////////
router.post("/", isAuthorized, async (req, res) => {
    const {
        parkName,
        state,
        visitDate,
        weather,
        tripSummary,
        additionalNotes,
        favoriteMoment,
        memorableSights,
        helpfulTips,
    } = req.body;

    // Validation check:
    if (!parkName || !state || !visitDate || !tripSummary) {
        return res.status(400).json({ message: "Your comment was missing a required field!" });
    }

    try {
        // Find the park by case-insensitive name:
        const park = await Park.findOne({ parkName: new RegExp(`^${parkName}$`, "i") });

        // If the named park can't be found, return a 404 error:
        if (!park) {
            return res.sendStatus(404);
        }

        // Get the named park's _id and use that to store the comment:
        const comment = await commentsDao.createComment({
            userId: req.user._id,
            parkId: park._id,
            state: state.toUpperCase(),
            visitDate,
            weather,
            tripSummary,
            additionalNotes,
            favoriteMoment,
            memorableSights,
            helpfulTips,
        });

        res.status(201).json(comment);
    } 
    
    catch (err) {
        res.sendStatus(500);
    }
});



//////////////////////////////////////////////////////////////////////////////////
// READ comments for a specific state - Publicly accessible without an account //
////////////////////////////////////////////////////////////////////////////////
router.get("/state/:stateCode", async (req, res) => {
    const state = req.params.stateCode?.toUpperCase();

    if (!["WA", "OR"].includes(state)) {
        return res.status(400).json({ message: "State must be 'WA' or 'OR'" });
    }

    try {
        const comments = await commentsDao.getCommentsByState(state);
        res.json(comments);
    }
    
    catch (err) {
        res.sendStatus(500);
    }
});



//////////////////////////////////////////////////////////////////////////////////
// READ comments for a specific park  - Publicly accessible without an account //
////////////////////////////////////////////////////////////////////////////////
router.get("/park/:parkName", async (req, res) => {
    const parkName = req.params.parkName?.trim();

    if (!parkName || parkName.length < 2) { return res.status(400).json({ message: "Invalid park name" }); }

    try {
        const comments = await commentsDao.getCommentsByParkName(parkName);

        if (comments === null) {
            return res.sendStatus(404);
        }

        res.json(comments);
    }
    
    catch (err) {
        res.sendStatus(500);
    }
});



/////////////////////////////////////////////////////////////////////////////////////////
// READ all comments made by a specific user - Publicly accessible without an account //
///////////////////////////////////////////////////////////////////////////////////////
router.get("/user/:username", async (req, res) => {
    const username = req.params.username?.trim();

    if (!username || username.length < 2) {
        return res.status(400).json({ message: "Invalid username" });
    }

    try {
        const comments = await commentsDao.getCommentsByUsername(username);

        if (comments === null) {
            return res.sendStatus(404);
        }

        res.json(comments);
    } 
    
    catch (err) {
        res.sendStatus(500);
    }
});



//////////////////////////////////////////
// UPDATE/Edit a comment - Admin only  //
////////////////////////////////////////
router.put("/:commentId", isAuthorized, isAdmin, async (req, res) => {
    const { commentId } = req.params;
    const updates = req.body;

    try {
        const updated = await commentsDao.updateComment(commentId, updates);
        if (!updated) return res.sendStatus(404);
        res.json(updated);
    } 
    
    catch (err) {
        res.sendStatus(500);
    }
});



/////////////////////////////////////
// DELETE a comment - Admin only  //
///////////////////////////////////
router.delete("/:commentId", isAuthorized, isAdmin, async (req, res) => {
    const { commentId } = req.params;

    try {
        const deleted = await commentsDao.deleteComment(commentId);
    
        if (!deleted) return res.sendStatus(404);
    
        res.json({ message: "Successfully deleted!" });
    } 
    
    catch (err) {
        res.sendStatus(500);
    }
});



module.exports = router;