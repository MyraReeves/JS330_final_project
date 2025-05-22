const express = require("express");
const Park = require("../models/parkModel");
const visitedDao = require("../DAOS/visitedDao");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();


/////////////////////////////////////////////////////////////////
// CREATE a "visited parks" list if the user doesn't have one //
///////////////////////////////////////////////////////////////
router.post("/", isAuthorized, async (req, res) => {
    try {
        const userId = req.user._id;
        const initialParks = req.body.parks || [];
        const existing = await visitedDao.getVisitedByUserId(userId);

        // If a list already exists for that user, throw an error:
        if (existing) return res.status(409).json({ message: "A list of visited parks already exists!" });

        // Otherwise, create a list using the inputed intial parks that were in the request body:
        const created = await visitedDao.createVisitedList(userId, initialParks);
        res.status(201).json(created);
    } 
    catch (err) {
        res.sendStatus(500);
    }
});


//////////////////////////////////////////////////////
// READ all visited parks for a specified username //
////////////////////////////////////////////////////
router.get("/username/:username", async (req, res) => {
    try {
        const visited = await visitedDao.getVisitedByUsername(req.params.username);

        // If nothing can be found return a 404 error:
        if (!visited) return res.status(404).json({ message: "The requested user doesn't exist or has not yet created a list" });

        // Otherwise, return their list:
        res.json(visited);
    }
    catch (err) {
        res.sendStatus(500);
    }
});


////////////////////////////////////////////////////////////////////
// READ which parks of one specified TYPE a username has visited //
//////////////////////////////////////////////////////////////////
router.get("/username/:username/type/:type", async (req, res) => {
    try {
        const parks = await visitedDao.getVisitedByType(req.params.username, req.params.type);

        // If nothing can be found return a 404 error:
        if (!parks) return res.status(404).json({ message: "Could not find any record of that username having visited any parks of that type" });

        // Otherwise, return a list of all the parks they've visited of that type:
        res.json(parks);
    }
    catch (err) {
        res.sendStatus(500);
    }
});


/////////////////////////////////////////////////////////////////////////
// READ which parks inside one specified STATE a username has visited //
///////////////////////////////////////////////////////////////////////
router.get("/username/:username/state/:state", async (req, res) => {
    try {
        const parks = await visitedDao.getVisitedByState(req.params.username, req.params.state);

        if (!parks) return res.status(404).json({ message: "Could not find any matches for that username and that state" });

        res.json(parks);
    }
    catch (err) {
        res.sendStatus(500);
    }
});


///////////////////////////////////////////////////////////////
// UPDATE - Add a new park to a user's "visited parks" list //
/////////////////////////////////////////////////////////////
router.put("/add-by-name/:parkName", isAuthorized, async (req, res) => {
    const parkName = req.params.parkName?.trim();

    // If the requested park name doesn't exist, return an error:
    if (!parkName || parkName.length < 2) {
    return res.status(400).json({ message: "Invalid park name entered" });
    }

    try {
        const park = await Park.findOne({ parkName });

        // If the requested park can't be found, throw an error:
        if (!park) {
        return res.status(404).json({ message: "No parks with that name were found" });
        }

        // Add the park to the visited list by its _id:
        const updated = await visitedDao.addParkToVisited(req.user._id, park._id);

        // Check whether a list exists for that user. If not, return an error:
        if (!updated) return res.status(404).json({ message: "List not found" });

        // Otherwise, send the updated list:
        res.json(updated);
    } 
    catch (err) {
        res.sendStatus(500);
    }
});


///////////////////////////////////////////////////////////////
// DELETE a park from the user's list (in case of mistakes) //
/////////////////////////////////////////////////////////////
router.delete("/remove-by-name/:parkName", isAuthorized, async (req, res) => {
    try {
        const park = await Park.findOne({ parkName: req.params.parkName.trim() });

        // If the requested park can't be found, return an error:
        if (!park) {
            return res.status(404).json({ message: "Park not found." });
        }

        const updated = await visitedDao.removeParkFromVisited(req.user._id, park._id);
    
        if (!updated) return res.sendStatus(404);

        res.json(updated);
    }
    catch (err) {
        res.sendStatus(500);
    }
});



module.exports = router;