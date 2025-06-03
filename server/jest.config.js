// NOTE:  The creation of this file was recommended by the internet to help my test files run more smoothly!

module.exports = {
  testEnvironment: "node",                  // Using Node.js instead of the default jsdom to prevent issues with Mongoose
  testTimeout: 10000,                     // Extend the timeout in case the DB or server takes extra time to run tests
};
