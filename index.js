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

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contact) => {
    res.json(contact)
  })
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
});

app.get("/info", (req, res) => {
  Contact.find({}).then((contact) => {
    res.send(`
      <p>Phonebook has info for ${contact.length} people</p>
      <p>${new Date()}</p>
    `);
  })
});

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

app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact);
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
