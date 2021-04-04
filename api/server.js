const express = require("express");
const helmet = require("helmet");

const SchemeRouter = require("./schemes/scheme-router.js");

const server = express();

server.use(express.json(), helmet());
server.use("/api/schemes", SchemeRouter);

server.use("/", (req, res) => {
  res.status(200).json({ message: "working?" });
});

server.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Server failed...";
  res.status(errorStatus).json({ message: errorMessage, stack: error.stack });
});

module.exports = server;
