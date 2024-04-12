const express = require("express");
const app = express();
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const home = require("./routes/home");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/movies-api")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB..."));

app.use(express.json()); //dodajemy middleware by parsowało json w req body

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/", home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port v${port}`));
