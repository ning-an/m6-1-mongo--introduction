const { MongoClient } = require("mongodb");
require("dotenv").config();
const assert = require("assert");

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercises");
    console.log("Connected!");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: req.body });

    client.close();
    console.log("Disconnected!");
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getGreeting = async (req, res) => {
  const _id = req.params._id.toUpperCase();
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercises");
  console.log("Connected!");

  const idRes = await db.collection("greetings").findOne({ _id });
  const langRes = await db
    .collection("greetings")
    .findOne({ lang: _id[0] + _id.slice(1).toLowerCase() });
  const result = idRes || langRes;
  result
    ? res.status(200).json({ status: 200, data: result })
    : res.status(404).json({ status: 404, data: "Not Found" });

  client.close();
  console.log("Disconnected!");
};

const getMultiGreetings = async (req, res) => {
  const start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 1;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercises");
  console.log("Connected");

  const docs = await db.collection("greetings").find().toArray();

  if (docs.length > 0) {
    res.status(200).json({
      status: 200,
      start,
      limit: docs.slice(start, start + limit).length,
      data: docs.slice(start, start + limit),
    });
  } else {
    res.status(404).json({ status: 404, msg: "not found" });
  }

  client.close();
  console.log("Disconnected");
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercises");
    console.log("Connected!");

    const result = await db.collection("greetings").deleteOne({ _id });
    res.status(204).send();
    console.log(result.deletedCount);

    client.close();
    console.log("Disconnected!");
  } catch (err) {
    res.status(404).json({ status: 404, msg: err });
  }
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;
  const newValues = { $set: { hello } };

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("exercises");
    console.log("Connected!");

    if (hello) {
      const r = await db.collection("greetings").updateOne({ _id }, newValues);
      console.log(r.matchedCount, r.modifiedCount);
      console.log(_id, newValues);
      assert.equal(1, r.matchedCount);
      assert.equal(1, r.modifiedCount);
      res.status(200).json({ status: 200, data: { _id, hello } });
    } else {
      throw new Error("missing hello as valid data");
    }
  } catch (err) {
    res.status(500).json({ status: 500, error: err.message });
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getMultiGreetings,
  deleteGreeting,
  updateGreeting,
};
