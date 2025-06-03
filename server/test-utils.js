const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const models = [
  require("./models/commentModel"),
  require("./models/parkModel"),
  require("./models/userModel"),
  require("./models/visitedModel"),
];

let mongod;

module.exports.connectDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  await Promise.all(models.map((m) => m.syncIndexes()));
};

module.exports.stopDB = async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
};

module.exports.clearDB = async () => {
  await Promise.all(models.map((model) => model.deleteMany()));
};

module.exports.findOne = async (model, query) => {
  const result = await model.findOne(query).lean();
  if (result) result._id = result._id.toString();
  return result;
};

module.exports.find = async (model, query) => {
  const results = await model.find(query).lean();
  results.forEach((result) => (result._id = result._id.toString()));
  return results;
};
