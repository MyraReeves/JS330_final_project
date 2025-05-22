const express = require("express");
const Visited = require("../models/visitedModel");
const visitedDao = require("../DAOS/visitedDao");
const isAuthorized = require("../middleware/isAuthorized");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();


//////////////////////////////////////////////////////
// READ all visited parks for a specified username //
////////////////////////////////////////////////////
router.get("/username/:username", async (req, res) => {
    try {
        const visited = await visitedDao.getVisitedByUsername(req.params.username);

        if (!visited) return res.status(404).json({ message: "User not found or no visited parks." });
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

        if (!parks) return res.status(404).json({ message: "User not found or no matching parks." });
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

        if (!parks) return res.status(404).json({ message: "User not found or no parks in that state." });
        res.json(parks);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
