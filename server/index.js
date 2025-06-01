// NOTE:  This file combines into one file the two separate files "index.js" and "server.js" that were used during homeworks.

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");           // Info at: https://expressjs.com/en/resources/middleware/cors.html
const morgan = require("morgan");       // HTTP request logger middleware for node.js
const app = express();

// Load environment variables from .env
dotenv.config();

// Use middleware:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));             // Info at https://expressjs.com/en/resources/middleware/morgan.html



// Connect to MongoDB:
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected successfully to MongoDB!  Woo-hoo! 🥳"))
.catch((error) => {
    console.error("❌ Failed to connect to MongoDB for the following reason:", error);
    process.exit(1);
});



// Connect to routes:
app.use("/api/auth", require("./routes/auth"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/parks", require("./routes/parks"));
app.use("/api/visited", require("./routes/visited"));


// Route not found handler:
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});


// Start the server:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
// NOTE:  The front-end will be running on port 3000 because that is what React uses by default