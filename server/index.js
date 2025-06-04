const mongoose = require("mongoose");
const app = require("./app");

// Load environment variables from .env
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB and the server:
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected successfully to MongoDB!  Woo-hoo! 🥳");

  // Start the server:
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });           // NOTE:  The front-end will be running on port 3000 because that is what React uses by default
})
.catch((error) => {
  console.error("💢 Failed to connect to MongoDB for the following reason:", error);
  process.exit(1);
});