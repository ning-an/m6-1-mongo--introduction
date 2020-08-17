"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1
  .get("/:dbName/:collection", (req, res) => {
    const { dbName, collection } = req.params;
    getUsers(dbName, collection).then((data) => {
      if (data.length > 0) {
        res.status(200).json({ status: 200, data });
      } else {
        res.status(404).json({ status: 404, msg: "empty array" });
      }
    });
  })

  .post("/:dbName/:collection", async (req, res) => {
    const data = req.body;
    const { dbName, collection } = req.params;
    console.log(dbName, collection);
    try {
      await addUser(dbName, collection, data);
      res.status(201).json({ status: 201 });
    } catch (err) {
      res.status(400).json({ status: 400 });
    }
  })
  // exercise 2

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
