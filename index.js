const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json()); //dodajemy middleware by parsowało json w req body

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
}); //odpowiadamy na request wysyłając wiadomość

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  // Walidacja żądania
  const { error } = schema.validate(req.body);

  // Jeśli wystąpił błąd walidacji, zwróć błąd 400 i przekaż informacje o błędzie
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course with a given ID was not found");
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port v${port}`));
