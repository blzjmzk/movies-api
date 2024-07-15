const express = require("express");
const genres = require("../routes/genres");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const movies = require("../routes/movies");
const error = require("../middleware/error");
const customers = require("../routes/customers");
const home = require("../routes/home");

module.exports = function (app) {
  app.use(express.json()); //dodajemy middleware by parsowało json w req body
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
