const request = require("supertest");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const server = require("../server");
const testUtils = require("../test-utils");
const User = require("../models/userModel");
process.env.JWT_SECRET = "testsecret";


describe("/auth", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

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
        const res = await request(server).post("/auth/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("PUT /password", () => {
      it("should return 401 - Valid authentication credentials not provided", async () => {
        const res = await request(server).put("/auth/password").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("POST /logout", () => {
      it("should return 404 - Not found", async () => {
        const res = await request(server).post("/auth/logout").send();
        expect(res.statusCode).toEqual(404);
      });
    });
  });

  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a username - Bad Request", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user0.email,
          password: user0.password,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if an empty string is entered as a username - Bad Request", async () => {
        const res = await request(server).post("/auth/signup").send({
          username: "",
          email: user1.email,
          password: user1.password,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if no email is entered - Bad Request", async () => {
        const res = await request(server).post("/auth/signup").send({
          username: user0.username,
          password: user0.password,
        });
        expect(res.statusCode).toEqual(400);
      });


      it("should return 400 if no password is entered - Bad Request", async () => {
        const res = await request(server).post("/auth/signup").send({
          username: user0.username,
          email: user0.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 if an empty string is entered as a password - Bad Request", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user1.email,
          password: "",
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 201 'Created' when signing up using valid credentials", async () => {
        const res = await request(server).post("/auth/signup").send(user1);
        expect(res.statusCode).toEqual(201);
      });

      it("should return 409 Conflict with a repeat signup attempt", async () => {
        let res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(201);
        res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });

      it("should not store raw passwords", async () => {
        await request(server).post("/auth/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user).includes(user0.password)).toBe(false);
        });
      });
    });
  });


});
