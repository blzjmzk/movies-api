const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//ściezka do logowania uzytkowników
router.post("/", async (req, res) => {
  //sprawdzamy login (email) i hasło
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //sprawdzamy, czy user jest juz zarejestrowany
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  //walidacja  hasła
  //metoda do porównania niehashed, plain text password (req.body.password) z hashed password (user.password)
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
