const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (dbName, collection) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  console.log("Connected!");

  const data = await db.collection(collection).find().toArray();

  client.close();
  console.log("disconnected!");

  return data;
};

module.exports = { getUsers };
