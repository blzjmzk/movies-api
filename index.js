const config = require("config");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const movies = require("./routes/movies");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const customers = require("./routes/customers");
const home = require("./routes/home");
const mongoose = require("mongoose");
const error = require("./middleware/error");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/movies-api")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB..."));

app.use(express.json()); //dodajemy middleware by parsowało json w req body
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
