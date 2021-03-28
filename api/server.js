const express = require("express");
const helmet = require("helmet");

const SchemeRouter = require("./schemes/scheme-router.js");

const server = express();

server.use(express.json(), helmet());
server.use("/api/schemes", SchemeRouter);

server.use("/", (req, res) => {
  res.status(200).json({ message: "api up" });
});

module.exports = server;
