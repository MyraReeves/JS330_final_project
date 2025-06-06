const express = require("express");
// const bcrypt = require("bcryptjs");   Removed because the internet says best practice is to hash in the model via pre-save instead of in the routes
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAdmin = require("../middleware/isAdmin");
const isAuthorized = require("../middleware/isAuthorized");
const userDao = require("../DAOS/userDao");
const router = express.Router();


//////////////////////
// New User Signup //
////////////////////
router.post("/signup", async (req, res) => {
    const { username, email, password, roles = ["user"] } = req.body;

    // Check first that the username, email, and password aren't empty strings. If they are, then return a 400 Bad Request error:
    if (!username || username.trim() === "" || !email || !password || password.trim() === ""){
        return res.status(400).json({ message: "ERROR:  Username, email, and password are all required fields" });
    }

    try {
        // const hashed = await bcrypt.hash(password, 10);     Removed because the internet says best practice is to hash in the model via pre-save instead of in the routes
        const user = await userDao.createUser({ username, email, password, roles });
        await user.save();
        res.status(201).json({ message: "New user successfully created!" });
    }
    catch (error) {
        // MongoDB/Mongoose uses its own error code 11000 when a unique constraint is violated — which is what will happen if the username or email already exists. It is better to convert that into the more widely recognized 409 Conflict error code:
        if (error.code === 11000) {
            return res.status(409).json({ message: "Repeat signup attempted. Email or username already exists." });
        }
        
        // Otherwise, a generic 400 error can be used for all other creation errors:
          res.sendStatus(400);
        }
});



/////////////////////////////////////////////////////
// Login  - Username is NOT needed for logging in //
///////////////////////////////////////////////////
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check that email and password have both been provided.  If not, return a 400 error:
    if (!email || !password || password.trim() === "") {
        return res.status(400).json({ message: "Your email and password are required for logging in" });
    }

    try {
        // Find the user within the database using their email address:
        const user = await userDao.findUserByEmail(email);

        // Return an "Unauthorized" error if the email address can't be found:
        if (!user) return res.sendStatus(401);

        // Compare the entered password with the one saved in the DB for that user:
        const match = await user.comparePassword(password)

        // Return an "Unauthorized" error if the password credentials don't match:
        if (!match) return res.sendStatus(401);

        // Otherwise, generate an encrypted JSON web token for the authenticated user. Note that userId is set by the system, whereas the username is set by the user during signup:
        const token = jwt.sign(
            { _id: user._id, username: user.username, email: user.email, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // and return it inside the response:
        res.json({ token });
    }

    // Send an internal server error 500 if the log in attempt fails for some other reason:
    catch (error) {
        console.error(error);       // For troubleshooting in terminal during development build
        res.sendStatus(500);
    }
});



///////////////////////////////////////////////////////////////////
// READ/GET all users - A user must be logged in to access this //
/////////////////////////////////////////////////////////////////
router.get("/", isAuthorized, async (req, res) => {
    try {
        const users = await userDao.getAllUsers();
        res.json(users);
    }
    // Send an interal server error 500 if the request failed for some other reason:
    catch (error) {
        res.sendStatus(500);
    }
});



////////////////////////////////////////////////////////////////////////////////////
// READ/GET one user by their username - A user must be logged in to access this //
//////////////////////////////////////////////////////////////////////////////////
router.get("/username/:username", isAuthorized, async (req, res) => {
    try {
        const user = await userDao.findUserByUsername(req.params.username);

        // Return an error if the user is not found:
        if (!user) return res.sendStatus(404);

        // Otherwise, return the user:
        res.json(user);
    }
    // Send an interal server error 500 if the request failed for some other reason:
    catch (error) {
        res.sendStatus(500);
    }
});



///////////////////////////////
// UPDATE - Change password //
/////////////////////////////
router.put("/password", isAuthorized, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Reject empty new passwords:
    if (!newPassword || newPassword.trim() === ""){
        return res.sendStatus(400);
    }

    try {
        // Find the user by their id:
        const user = await User.findById(req.user._id).select("+password");         // Overrides the default password exclusion rule

        // Return an error if the user is not found:
        if (!user) return res.sendStatus(404);

        // Compare the entered password with the one saved inside the DB
        const match = await user.comparePassword(oldPassword);

        // Return an "Unauthorized" error if the previous password that is entered does not match what was saved:
        if (!match) return res.sendStatus(401);

        // Otherwise, encrypt the new password using the pre-save instructions in the model file:
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password successfully updated!" });
    }

    // Send an interal server error 500 if the password change failed for some other reason:
    catch (error) {
        console.error("The following error occurred when attempting to change the password:", error);
        res.sendStatus(500);
    }
});



/////////////////////////////////
// DELETE a user - Admin only //
///////////////////////////////
router.delete("/:id", isAuthorized, isAdmin, async (req, res) => {
    try {
        const deleted = await userDao.deleteUser(req.params.id);

        // If the user is not found, return a 404 error:
        if (!deleted) return res.sendStatus(404);

        // Otherwise, send confirmation that the user was deleted:
        res.json({ message: "User was successfully deleted" });
    } 
    catch (err) {
        res.sendStatus(500);
    }
  });



module.exports = router;



/*
Note from the internet concerning whether to have a logout route:

"In simple apps, logging out is often handled 100% on the frontend with something like:  localStorage.removeItem("token");

You only need a logout route if:

-- You’re managing a token blocklist on the server.
-- You want to track/log logout events.
-- You store tokens in HTTP-only cookies and want the server to clear them.
-- You want to perform some kind of cleanup or trigger a "user just logged out" signal.

For your app, none of those seem necessary."

*/