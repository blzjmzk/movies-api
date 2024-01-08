const Joi = require("joi");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const home = require("./routes/home");

app.use(express.json()); //dodajemy middleware by parsowało json w req body

app.use("/api/genres", genres);
app.use("/", home);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port v${port}`));
