const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

const bodyToken = (req, res) => JSON.stringify(req.body);
morgan.token("body", bodyToken);

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 100) + 1;

  return time + random;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(400).json({ error: "Contact not found" });
  }

  persons = persons.filter((person) => person.id !== id);
  return res.sendStatus(204);
});

app.post("/api/persons", (req, res) => {
  const nameExists = persons.find((person) => person.name === req.body.name);

  if (nameExists) {
    return res.status(409).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name: req.body.name,
    number: req.body.number,
  };

  persons = persons.concat(newPerson);

  return res.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
