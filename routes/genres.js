const express = require("express");
const router = express.Router();

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Documentary" },
  { id: 3, name: "Sci-fi" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with a given ID was not found");
  res.send(genre);
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

module.exports = router;
