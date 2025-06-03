const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const testUtils = require("../test-utils");
const User = require("../models/userModel");
const Park = require("../models/parkModel");
const Visited = require("../models/visitedModel");

process.env.JWT_SECRET = "testsecret";

let server
let userToken, userId;
let park1, park2;

jest.setTimeout(30000);  //Allows for a longer, 30 second timeout for troubleshooting purposes


// Connect to the in-memory test database and start the Express server on a new port for testing:
beforeAll(async () => {
  await testUtils.connectDB();
  server = app.listen(5008);
});

// Clear all the testing data between tests:
afterEach(async () => {
  await testUtils.clearDB();
});

// Disconnect from the in-memory test database and close the server:
afterAll(async () => {
  await testUtils.stopDB();
  await new Promise((resolve, reject) => {
    server.close(err => {
      if (err) return reject(err);
      resolve();
    });
  });
});

beforeEach(async () => {
  // Create a test user:
  const user = new User({
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword",
    roles: ["user"],
  });
  // Hash their password while their account is saved:
  const savedUser = await user.save();
  userId = savedUser._id;

  // Create a JWT token for that user:
  userToken = jwt.sign(
    {
      _id: userId,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );

  // Create parks inside the testing database
  park1 = await Park.create({
    parkName: "Mount Rainier National Park",
    state: "WA",
    parkType: "NP",
    description: "A park in WA.",
    websiteURL: "https://www.nps.gov/mora",
    visitorCenterHours: "9am - 5pm",
    streetAddress: "123 Rainier Rd",
    city: "Ashford",
    zipcode: "98304",
    phone: "360-569-2211",
    googleMaps: "https://maps.app.goo.gl/rainier"
  });

  park2 = await Park.create({
    parkName: "Crater Lake National Park",
    state: "OR",
    parkType: "NP",
    description: "A park in OR.",
    websiteURL: "https://www.nps.gov/crla",
    visitorCenterHours: "9am - 5pm",
    streetAddress: "1 Rim Dr",
    city: "Crater Lake",
    zipcode: "97604",
    phone: "541-594-3000",
    googleMaps: "https://maps.app.goo.gl/craterlake"
  });

  // Create an initial visited list that has park1 in it:
  await request(app)
  .post("/api/visited")
  .set("Authorization", `Bearer ${userToken}`)
  .send({ parks: [park1._id] });
});



describe("Visited Routes", () => {
  it("should allow a user to create a list of parks they have visited, if one doesn't already exist", async () => {
    const res = await request(app)
    .post("/api/visited")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ parks: [park1._id] });

    expect(res.statusCode).toBe(409);   // Ack! A list was already created above for use in testing
  });

  it("should prevent more than one visited list from being created", async () => {
    const res = await request(app)
      .post("/api/visited")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ parks: [park1._id] });

    expect(res.statusCode).toBe(409);
  });

  it("should retrieve a user's list when given their username", async () => {
    const res = await request(app).get("/api/visited/username/testuser");
    expect(res.statusCode).toBe(200);
    expect(res.body.userId).toBeDefined();
    expect(res.body.parks[0].parkName).toBe("Mount Rainier National Park");
  });

  it("should add a park to a user's list when they request it", async () => {
    const res = await request(app)
    .put("/api/visited/add-by-name/Crater Lake National Park")
    .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.parks.length).toBe(2);
    const names = res.body.parks.map(p => p.parkName);
    expect(names).toContain("Crater Lake National Park");
  });

  it("should return a user's visited parks for a specified state and username", async () => {
    // Add an Oregon park before performing this test:
    await request(app)
    .put("/api/visited/add-by-name/Crater Lake National Park")
    .set("Authorization", `Bearer ${userToken}`);

    // Now attempt to perform the GET request:
    const res = await request(app).get("/api/visited/username/testuser/state/OR");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].state).toBe("OR");
  });

  it("should return all of a user's visited parks that are of a specified type", async () => {
    // Add a second park to the user's list before performing this test:
    await request(app)
    .put("/api/visited/add-by-name/Crater Lake National Park")
    .set("Authorization", `Bearer ${userToken}`);

    // Now perform the test:
    const res = await request(app).get("/api/visited/username/testuser/type/NP");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("should remove a park from a user's list", async () => {
    const res = await request(app)
      .delete("/api/visited/remove-by-name/Mount Rainier National Park")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    const names = res.body.parks.map(p => p.parkName);
    expect(names).not.toContain("Mount Rainier National Park");
  });
});
