const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (dbName, collection, data) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  console.log("Connected!");

  await db.collection(collection).insertOne(data);

  client.close();
  console.log("Disconnected!");
};

module.exports = { addUser };
