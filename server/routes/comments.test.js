const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const testUtils = require("../test-utils");

const User = require("../models/userModel");
const Park = require("../models/parkModel");
const Comment = require("../models/commentModel");

process.env.JWT_SECRET = "testsecret";

let server;

describe("/comments", () => {
  let adminToken;
  let userToken;
  let testPark;
  let commentId;

  const admin = {
    username: "Admin Tester",
    email: "admin@test.com",
    password: "adminpass",
    roles: ["admin"],
  };

  const user = {
    username: "Regular User",
    email: "user@test.com",
    password: "userpass",
    roles: ["user"],
  };

  const parkData = {
    parkName: "Olympic National Park",
    state: "WA",
    parkType: "NP",
    description: "Test park",
    websiteURL: "https://nps.gov",
    visitorCenterHours: "8am - 5pm",
    streetAddress: "123 Park Ln",
    city: "Port Angeles",
    zipcode: "98362",
    phone: "360-123-4567",
    googleMaps: "https://maps.app.goo.gl/test"
  };

  beforeAll(async () => {
    await testUtils.connectDB();
    server = app.listen(5010);
  });

  afterEach(async () => {
    await testUtils.clearDB();
  });

  afterAll(async () => {
    await testUtils.stopDB();
    await new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  });

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

    testPark = await new Park(parkData).save();
  });

  describe("POST /", () => {
    it("should reject unauthenticated users", async () => {
      const res = await request(server).post("/api/comments").send({});
      expect(res.statusCode).toBe(401);
    });


    it("should return 400 if any required fields are missing", async () => {
      const res = await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)

        // Send a comment that is missing the required tripSummary and visitDate:
        .send({ parkName: testPark.parkName, state: "WA" });

      expect(res.statusCode).toBe(400);
    });


    it("should return 404 if the requested park does not exist", async () => {
      const res = await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: "Nonexistent Park",
          state: "WA",
          visitDate: new Date(),
          tripSummary: "Test summary",
        });
      expect(res.statusCode).toBe(404);
    });


    it("should create a comment with valid input", async () => {
      const res = await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          weather: "Sunny",
          tripSummary: "Had a great time!",
          additionalNotes: "Bring sunscreen.",
          favoriteMoment: "Hiking the ridge",
          memorableSights: "Mountains",
          helpfulTips: "Get there early.",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.tripSummary).toBe("Had a great time!");
      commentId = res.body._id;
    });
  });



  describe("GET /state/:stateCode", () => {
    it("should return a 400 error if an invalid state is requested", async () => {
      const res = await request(server).get("/api/comments/state/CA");
      expect(res.statusCode).toBe(400);
    });


    it("should return all comments for a valid state", async () => {
      // Create a comment first:
      await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          tripSummary: "Nice visit",
        });

      // Then test getting it when WA is used as the requested state:
      const res = await request(server).get("/api/comments/state/wa");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].state).toBe("WA");
    });
  });



  describe("GET /park/:parkName", () => {
    it("should return 400 for an invalid park name", async () => {
      const res = await request(server).get("/api/comments/park/a");
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 if the park is not found", async () => {
      const res = await request(server).get("/api/comments/park/Nonexistent");
      expect(res.statusCode).toBe(404);
    });

    it("should return comments for a valid park", async () => {
      await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          tripSummary: "Great views",
        });

      const res = await request(server).get(
        `/api/comments/park/${encodeURIComponent(testPark.parkName)}`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].tripSummary).toBe("Great views");
    });
  });



  describe("GET /user/:username", () => {
    it("should return a 400 error for an invalid username", async () => {
      const res = await request(server).get("/api/comments/user/a");
      expect(res.statusCode).toBe(400);
    });

    it("should return a 404 error if the requeted user does not exist", async () => {
      const res = await request(server).get("/api/comments/user/NotAUser");
      expect(res.statusCode).toBe(404);
    });

    it("should return comments for a valid username", async () => {
      await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          tripSummary: "Loved it!",
        });

      const res = await request(server).get("/api/comments/user/Regular%20User");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].tripSummary).toBe("Loved it!");
    });
  });



  describe("PUT /:commentId", () => {
    let comment;

    beforeEach(async () => {
      const res = await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          tripSummary: "Original Summary",
        });
      comment = res.body;
    });

    it("should refuse to allow editing of comments for any users who are not admins", async () => {
      const res = await request(server)
        .put(`/api/comments/${comment._id}`)
        .set("Authorization", "Bearer " + userToken)
        .send({ tripSummary: "Updated!" });
      expect(res.statusCode).toBe(403);
    });

    it("should return a 404 error if the comment doesn't exist", async () => {
      const res = await request(server)
        .put("/api/comments/64b9caccf0a0f0f0f0f0f0f0")
        .set("Authorization", "Bearer " + adminToken)
        .send({ tripSummary: "No comment" });
      expect(res.statusCode).toBe(404);
    });

    it("should edit a comment if the request comes from an authenticated admin", async () => {
      const res = await request(server)
        .put(`/api/comments/${comment._id}`)
        .set("Authorization", "Bearer " + adminToken)
        .send({ tripSummary: "Updated Summary" });
      expect(res.statusCode).toBe(200);
      expect(res.body.tripSummary).toBe("Updated Summary");
    });
  });



  describe("DELETE /:commentId", () => {
    let comment;

    beforeEach(async () => {
      const res = await request(server)
        .post("/api/comments")
        .set("Authorization", "Bearer " + userToken)
        .send({
          parkName: testPark.parkName,
          state: "WA",
          visitDate: new Date(),
          tripSummary: "To be deleted",
        });
      comment = res.body;
    });

    it("should not allow deletion of comments if the requesting user is not an admin", async () => {
      const res = await request(server)
        .delete(`/api/comments/${comment._id}`)
        .set("Authorization", "Bearer " + userToken);
      expect(res.statusCode).toBe(403);
    });

    it("should return a 404 error if the requested comment does not exist in the database", async () => {
      const res = await request(server)
        .delete("/api/comments/64b9caccf0a0f0f0f0f0f0f0")
        .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toBe(404);
    });

    it("should delete a comment if the request comes from an admin", async () => {
      const res = await request(server)
        .delete(`/api/comments/${comment._id}`)
        .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Successfully deleted!");
    });
  });
});
