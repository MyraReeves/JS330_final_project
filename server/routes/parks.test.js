const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const testUtils = require("../test-utils");
const User = require("../models/userModel");
const Park = require("../models/parkModel");

process.env.JWT_SECRET = "testsecret";

let server;

describe("/parks", () => {
  let adminToken;
  let userToken;
  let testPark;

  // Create an admin account for testing purposes:
  const admin = {
    username: "Admin User",
    email: "admin@example.com",
    password: "adminpass",
    roles: ["admin"],
  };

  // Create a user account for testing purposes:
  const user = {
    username: "Normal User",
    email: "user@example.com",
    password: "userpass",
    roles: ["user"],
  };

  // Create a mock WA park object for testing purposes:
  const parkData = {
    parkName: "Olympic National Park",
    state: "WA",
    parkType: "NP",
    description: "A large wilderness park in Washington state.",
    websiteURL: "https://www.nps.gov/olym/index.htm",
    visitorCenterHours: "9am - 5pm",
    streetAddress: "600 E Park Ave",
    city: "Port Angeles",
    zipcode: "98362",
    phone: "360-565-3130",
    googleMaps: "https://maps.app.goo.gl/somevalidurl"
  };

  // Create a mock OR park object as well:
  const oregonParkData = {
    parkName: "Crater Lake National Park",
    state: "OR",
    parkType: "NP",
    description: "A beautiful volcanic lake in Oregon.",
    websiteURL: "https://www.nps.gov/crla/index.htm",
    visitorCenterHours: "8am - 6pm",
    streetAddress: "1 S Entrance Rd",
    city: "Crater Lake",
    zipcode: "97604",
    phone: "541-594-3000",
    googleMaps: "https://maps.app.goo.gl/someoregonpark"
  };

  // Connect to the in-memory test database and start the Express server on a new port for testing:
  beforeAll(async () => {
    await testUtils.connectDB();
    server = app.listen(5006);
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

  // Hash the passwords for the testing admin and testing user accounts:
  beforeEach(async () => {
    await new User(admin).save();
    await new User(user).save();

    const resAdmin = await request(server).post("/api/auth/login").send({
      email: admin.email,
      password: admin.password,
    });
    adminToken = resAdmin.body.token;

    const resUser = await request(server).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });
    userToken = resUser.body.token;

    // Save the Washington test park:
    testPark = await new Park(parkData).save();

    // Save the Oregon test park:
    await new Park(oregonParkData).save();
  });


  describe("POST /", () => {
    it("should reject any unauthenticated users from being able to create new parks in the database", async () => {
      const res = await request(server).post("/api/parks").send(parkData);
      expect(res.statusCode).toBe(401);
    });

    it("should reject non-admin users from being able to add new parks", async () => {
      const res = await request(server)
        .post("/api/parks")
        .set("Authorization", "Bearer " + userToken)
        .send(parkData);
      expect(res.statusCode).toBe(403);
    });

    it("should allow admins with a valid token to create a park", async () => {
      const res = await request(server)
        .post("/api/parks")
        .set("Authorization", "Bearer " + adminToken)
        .send({
          ...parkData,
          parkName: "Mount Rainier National Park",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.parkName).toBe("Mount Rainier National Park");
    });
  });

  describe("GET /", () => {
    it("should return all parks currently inside the testing database", async () => {
      const res = await request(server).get("/api/parks");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].parkName).toBe(parkData.parkName);
    });
  });

  describe("GET /state/:state", () => {
    it("should return all parks in WA when the state is specified and not return any other state's parks", async () => {
      const res = await request(server).get("/api/parks/state/wa");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].state).toBe("WA");
      expect(res.body.every(p => p.state === "WA")).toBe(true);
    });

    it("should return all parks in OR when the state is specified and not return any other state's parks", async () => {
      const res = await request(server).get("/api/parks/state/or");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].state).toBe("OR");
      expect(res.body.every(p => p.state === "OR")).toBe(true);
    });

    it("should return 400 if an invalid state is requested", async () => {
      const res = await request(server).get("/api/parks/state/CA");
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /name/:parkName", () => {
    it("should return a single park object by name", async () => {
      const res = await request(server).get(`/api/parks/name/${encodeURIComponent(parkData.parkName)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.parkName).toBe(parkData.parkName);
    });

    it("should return 404 if the requested park is not found in the database", async () => {
      const res = await request(server).get("/api/parks/name/UnknownPark");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /:id", () => {
    it("should reject non-admins from being able to update the park objects", async () => {
      const res = await request(server)
        .put(`/api/parks/${testPark._id}`)
        .set("Authorization", "Bearer " + userToken)
        .send({ description: "Updated!" });
      expect(res.statusCode).toBe(403);
    });

    it("should update a park if the requesting account is an admin", async () => {
      const res = await request(server)
        .put(`/api/parks/${testPark._id}`)
        .set("Authorization", "Bearer " + adminToken)
        .send({ description: "Updated description" });
      expect(res.statusCode).toBe(200);
      expect(res.body.description).toBe("Updated description");
    });

    it("should return 404 if the park to be updated doesn't exist in the database", async () => {
      const res = await request(server)
        .put("/api/parks/64b9caccf0a0f0f0f0f0f0f0")
        .set("Authorization", "Bearer " + adminToken)
        .send({ description: "Nope" });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /:id", () => {
    it("should refuse park deletion attempts by non-admins", async () => {
      const res = await request(server)
        .delete(`/api/parks/${testPark._id}`)
        .set("Authorization", "Bearer " + userToken);
      expect(res.statusCode).toBe(403);
    });

    it("should delete a park object from the database if an admin requests it", async () => {
      const res = await request(server)
        .delete(`/api/parks/${testPark._id}`)
        .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/successfully deleted/i);

      const deleted = await Park.findById(testPark._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 if the park to be deleted doesn't exist in the database", async () => {
      const res = await request(server)
        .delete("/api/parks/64b9caccf0a0f0f0f0f0f0f0")
        .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toBe(404);
    });
  });
});
