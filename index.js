const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const app = express();
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");
const genres = require("./routes/genres");
const home = require("./routes/home");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); //dodajemy middleware by parsowało json w req body
app.use(helmet());
app.use(logger);
app.use(authenticator);
app.use("/api/genres", genres);
app.use("/", home);

//Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port v${port}`));
