require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const Contact = require("./models/persons")

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

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contact) => {
    res.json(contact)
  })
});

app.get("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id).then(contact => {
    res.json(contact)
  })
});

// app.get("/info", (req, res) => {
//   res.send(`
//     <p>Phonebook has info for ${persons.length} people</p>
//     <p>${new Date()}</p>
//   `);
// });

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
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


app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
