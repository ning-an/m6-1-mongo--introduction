const fs = require("file-system");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercises");
  console.log("Connected!");

  const r = await db.collection("greetings").insertMany(greetings);
  assert.equal(greetings.length, r.insertedCount);

  client.close();
  console.log("Disconnected!");
};

batchImport();
