const express = require("express");
const router = express.Router();
const parkDao = require("../DAOS/parkDao");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");


//////////////////////////////////////
// CREATE a new park  - Admin only //
////////////////////////////////////
router.post("/", isAuthorized, isAdmin, async (req, res) => {
    try {
        const park = await parkDao.createPark(req.body);
        res.status(201).json(park);
    }

    // A generic 400 error can be used for all creation errors:
    catch (error) {
        res.sendStatus(400);
    }
});


/////////////////////////
// READ/Get all parks //
///////////////////////
router.get("/", async (req, res) => {
    try {
        const parks = await parkDao.getAllParks();
        res.json(parks);
    }

    // Send an internal server error 500 if the attempt fails for some reason:
    catch (error) {
        res.sendStatus(500);
    }
});


//////////////////////////////////////////////
// READ/GET all parks in a specified state //
////////////////////////////////////////////
router.get("/state/:state", async (req, res) => {
    const state = req.params.state.toUpperCase();

    // Limit results to only Washington or Oregon
    if (!["WA", "OR"].includes(state)) {
        return res.status(400).json({ message: "Invalid state. The database is currently limited to only parks in 'WA' or 'OR'." });
    }

    try {
        const parks = await parkDao.getParksByState(state);
        res.json(parks);
    }

    // Send an internal server error 500 if the attempt fails for some reason:
    catch (error) {
       res.status(500).json({ message: "Failed to fetch parks by state" });
    }
});


/////////////////////////////////////////
// READ/GET a single park by its name //
///////////////////////////////////////
router.get("/name/:parkName", async (req, res) => {
    try {
        const park = await parkDao.getParkByName(req.params.parkName);

        // Check whether the park exists in the database. If not, return a 404 error: 
        if (!park) return res.sendStatus(404);

        // Otherwise, return the requested park:
        res.json(park);
    }
    // All other errors can return a generic internal server error 500 if the attempt fails:
    catch (error) {
        res.sendStatus(500);
    }
});


//////////////////////////////////
// UPDATE a park  - Admin only //
////////////////////////////////
router.put("/:id", isAuthorized, isAdmin, async (req, res) => {
    try {
        const updated = await parkDao.updatePark(req.params.id, req.body);

        // Check that the park exists in the database. Return a 404 error if not:
        if (!updated) return res.status(404).json({ message: "Park not found" });

        // Otherwise, send the updated data:
        res.json(updated);
    }

    // A generic 400 error can be used for all other update errors:
    catch (error) {
        res.status(400).json({ error });
    }
});


//////////////////////////////////
// DELETE a park  - Admin only //
////////////////////////////////
router.delete("/:id", isAuthorized, isAdmin, async (req, res) => {
    try {
        const deleted = await parkDao.deletePark(req.params.id);

        // Check that the park exists and return a 404 error if not:
        if (!deleted) return res.status(404).json({ message: "Park not found" });

        // Otherwise, send confirmation that the park was successfully deleted:
        res.json({ message: "The park was successfully deleted" });
    }
    // Send an internal server error 500 if the attempt fails for some reason:
    catch (error) {
        res.status(500).json({ message: "Failed to delete" });
    }
});



module.exports = router;