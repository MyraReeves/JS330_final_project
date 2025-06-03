require("dotenv").config();
const express = require("express");
const cors = require("cors");           // Info at: https://expressjs.com/en/resources/middleware/cors.html
const morgan = require("morgan");       // HTTP request logger middleware for node.js

const app = express();

// Use middleware:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));               // Info at https://expressjs.com/en/resources/middleware/morgan.html

// Connect to routes:
app.use("/api/auth", require("./routes/auth"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/parks", require("./routes/parks"));
app.use("/api/visited", require("./routes/visited"));

// Route not found handler:
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
