const request = require("supertest");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../app");
const testUtils = require("../test-utils");
const User = require("../models/userModel");
process.env.JWT_SECRET = "testsecret";
let server;

describe("/auth", () => {

  beforeAll(async () => {
    await testUtils.connectDB();           // Connect to the in-memory test database
    server = app.listen(5005);             // Start the Express server on a new port for testing
  });

  afterEach(async () => {
    await testUtils.clearDB();
  });            // Clear all the testing data between tests

  afterAll(async () => {
    await testUtils.stopDB();              // Disconnect from the in-memory test database
    await new Promise((resolve, reject) => {
      server.close((err) => {             // Close the server
        if (err) return reject(err);
        resolve();
      });
    });
  })

  const user0 = {
    username: "John Doe",
    email: "user0@mail.com",
    password: "123password",
  };

  const user1 = {
    username: "Jane Doe",
    email: "user1@mail.com",
    password: "456password",
  };


  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401 - Valid authentication credentials not provided", async () => {
        const res = await request(server).post("/api/auth/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });


    describe("PUT /password", () => {
      it("should return 401 - Valid authentication credentials not provided", async () => {
        const res = await request(server).put("/api/auth/password").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

  });



  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a username - Bad Request", async () => {
        const res = await request(server).post("/api/auth/signup").send({
          email: user0.email,
          password: user0.password,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if an empty string is entered as a username - Bad Request", async () => {
        const res = await request(server).post("/api/auth/signup").send({
          username: "",
          email: user1.email,
          password: user1.password,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if no email is entered - Bad Request", async () => {
        const res = await request(server).post("/api/auth/signup").send({
          username: user0.username,
          password: user0.password,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if no password is entered - Bad Request", async () => {
        const res = await request(server).post("/api/auth/signup").send({
          username: user0.username,
          email: user0.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if an empty string is entered as a password - Bad Request", async () => {
        const res = await request(server).post("/api/auth/signup").send({
          email: user1.email,
          password: "",
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 201 'Created' when signing up using valid credentials", async () => {
        const res = await request(server).post("/api/auth/signup").send(user1);
        expect(res.statusCode).toEqual(201);
      });

      it("should return 409 CONFLICT if there is a repeat signup attempt", async () => {
        let res = await request(server).post("/api/auth/signup").send(user0);
        expect(res.statusCode).toEqual(201);
        res = await request(server).post("/api/auth/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });

      it("should not store raw passwords", async () => {
        await request(server).post("/api/auth/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user).includes(user0.password)).toBe(false);
        });
      });
    });
  });



  describe.each([user0, user1])("User %#", (user) => {
    beforeEach(async () => {
      const hashed0 = await bcrypt.hash(user0.password, 10);
      const hashed1 = await bcrypt.hash(user1.password, 10);
      await User.create({ username: user0.username, email: user0.email, password: hashed0, roles: ["user"]});
      await User.create({ username: user1.username, email: user1.email, password: hashed1, roles: ["user"]});
    });

    describe("POST /", () => {
      it("should return 400 (Bad Request) if a password isn't provided during logging in", async () => {
        const res = await request(server).post("/api/auth/login").send({
          email: user.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 401 if the entered password doesn't match what's on file - Valid authentication credentials not provided", async () => {
        const res = await request(server).post("/api/auth/login").send({
          email: user.email,
          password: "123",
        });
        expect(res.statusCode).toEqual(401);
      });

      it("should return 200 OK and a token when password matches", async () => {
        const res = await request(server).post("/api/auth/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body.token).toEqual("string");
      });

      it("should not store the user token", async () => {
        const res = await request(server).post("/api/auth/login").send(user);
        const token = res.body.token;
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(token);
        });
      });

      it("should return a JWT with username, email, _id, and roles inside, but not password", async () => {
        const res = await request(server).post("/api/auth/login").send(user);
        const token = res.body.token;
        const decodedToken = jwt.decode(token);
        expect(decodedToken.username).toEqual(user.username);
        expect(decodedToken.email).toEqual(user.email);
        expect(decodedToken.roles).toEqual(["user"]);
        expect(decodedToken._id).toMatch(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,           // Regex for Mongo's _id
        );
        expect(decodedToken.password).toBeUndefined();
      });
    });
  });



  describe("After a user logs in", () => {
    let token0;
    let token1;

    beforeEach(async () => {
      await request(server).post("/api/auth/signup").send(user0);
      const res0 = await request(server).post("/api/auth/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/api/auth/signup").send(user1);
      const res1 = await request(server).post("/api/auth/login").send(user1);
      token1 = res1.body.token;
    });

    describe("PUT /password", () => {
      it("should reject a bogus token", async () => {
        const res = await request(server)
          .put("/api/auth/password")
          .set("Authorization", "Bearer BAD")
          .send({ password: "123" });
        expect(res.statusCode).toEqual(401);          // 401 indicates invalid authentication credentials
      });

      it("should reject an empty password", async () => {
        const res = await request(server)
          .put("/api/auth/password")
          .set("Authorization", "Bearer " + token0)
          .send({ password: "" });
        expect(res.statusCode).toEqual(400);          // 400 is a generic "BAD REQUEST" code
      });

      it("should change the password for user0", async () => {
        const res = await request(server)
          .put("/api/auth/password")
          .set("Authorization", "Bearer " + token0)
          .send({ oldPassword: user0.password, newPassword: "123" });
        expect(res.statusCode).toEqual(200);
        let loginRes0 = await request(server).post("/api/auth/login").send(user0);
        expect(loginRes0.statusCode).toEqual(401);
        loginRes0 = await request(server).post("/api/auth/login").send({
          email: user0.email,
          password: "123",
        });
        expect(loginRes0.statusCode).toEqual(200);
        const loginRes1 = await request(server).post("/api/auth/login").send(user1);
        expect(loginRes1.statusCode).toEqual(200);
      });
      
      it("should change the password for user1", async () => {
        const res = await request(server)
          .put("/api/auth/password")
          .set("Authorization", "Bearer " + token1)
          .send({ oldPassword: user1.password, newPassword: "123" });
        expect(res.statusCode).toEqual(200);
        const loginRes0 = await request(server).post("/api/auth/login").send(user0);
        expect(loginRes0.statusCode).toEqual(200);
        let loginRes1 = await request(server).post("/api/auth/login").send(user1);
        expect(loginRes1.statusCode).toEqual(401);
        loginRes1 = await request(server).post("/api/auth/login").send({
          email: user1.email,
          password: "123",
        });
        expect(loginRes1.statusCode).toEqual(200);
      });
    });
  });



  describe("DELETE /:id", () => {
    let adminToken, userToken, targetUserId;

    beforeEach(async () => {
      // Create an admin user:
      const adminHashed = await bcrypt.hash("adminpass", 10);
      const adminUser = await User.create({
        username: "Admin",
        email: "admin@email.com",
        password: adminHashed,
        roles: ["admin"],
      });

      // Create a user to be deleted:
      const userHashed = await bcrypt.hash("userpass", 10);
      const targetUser = await User.create({
        username: "DeleteMe",
        email: "usertodelete@email.com",
        password: userHashed,
        roles: ["user"],
      });

      targetUserId = targetUser._id;

      // Login both the admin and the user to be deleted:
      const resAdmin = await request(server).post("/api/auth/login").send({
        email: "admin@email.com",
        password: "adminpass",
      });

      adminToken = resAdmin.body.token;

      const resUser = await request(server).post("/api/auth/login").send({
        email: "usertodelete@email.com",
        password: "userpass",
      });

      userToken = resUser.body.token;
    });

    it("should return a 403 FORBIDDEN error if a non-admin user tries to delete another user", async () => {
      const res = await request(server)
        .delete(`/api/auth/${targetUserId}`)
        .set("Authorization", "Bearer " + userToken);
      expect(res.statusCode).toEqual(403);
    });

    it("should return a 404 NOT FOUND error if attempting to delete a non-existent user", async () => {
      const fakeId = "64b9caccf0a0f0f0f0f0f0f0"; // This is a valid ObjectId format but it is not an id in database
      const res = await request(server)
        .delete(`/api/auth/${fakeId}`)
        .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toEqual(404);
    });

    it("should allow an admin to delete a user, return a 200 OK code, and text confirmation of deletion", async () => {
      const res = await request(server)
      .delete(`/api/auth/${targetUserId}`)
      .set("Authorization", "Bearer " + adminToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "User was successfully deleted" });

      // Test to verify the user is truly gone after deletion:
      const deletedUser = await User.findById(targetUserId);
      expect(deletedUser).toBeNull();
    });
  });


});