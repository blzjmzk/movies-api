const Joi = require("joi");
const express = require("express");
const app = express();
const logger = require("./logger");
const authenticator = require("./authenticator");

app.use(express.json()); //dodajemy middleware by parsowało json w req body

app.use(logger);

app.use(authenticator);

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Documentary" },
  { id: 3, name: "Sci-fi" },
];

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

app.get("/", (req, res) => {
  res.send("Hello World");
}); //odpowiadamy na request wysyłając wiadomość

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with a given ID was not found");
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  //spradzamy czy gatunek istnieje, jezeli nie – zwracamy błąd 404
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with a given ID was not found");

  // Walidacja żądania, jeśli invalid zwracamy błąd
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //aktualizujemy element
  genre.name = req.body.name;

  //zwracamy element klientowi
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  //sprawdzamy, czy gatunek istnieje, jęśli nie zwracamy błąd
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with a given ID was not found");

  //usuwamy kurs
  const index = genres.indexOf(genre); //znajdujemy index kursu do usunięcia
  genres.splice(index, 1); //usuwamy kurs o danym indeksie

  //zwracamy usunięty kurs
  res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port v${port}`));
