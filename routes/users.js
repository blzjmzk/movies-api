const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

//zwracanie zalogowanego uzytkownika
router.get("/me", auth, async (req, res) => {
  //id pochodzi z tokena
  //wykluczamy hasło, nie chcemy go zwracać uzytkownikowi
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//ściezka do tworzenia (rejestrowania) nowego uzytkownika
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //sprawdzamy, czy user jest juz zarejestrowany
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  //zapisujemy uzytkownika w bazie
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt); //zwraca hashowane hasło na które aktualizujemy hasło w plain tekst
  await user.save();

  const token = user.generateAuthToken();

  // nie chcemy zwracać uzytkownikowi hasła, więc wybieramy niektóre
  //zwracamy token w response header (name, value)
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
