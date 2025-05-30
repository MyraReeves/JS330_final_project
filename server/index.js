const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// Load environment variables from .env
dotenv.config();

// Use middleware:
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logs HTTP requests to the console


// Connect to MongoDB:
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((error) => {
    console.error("❌ MongoDB connection error:");
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