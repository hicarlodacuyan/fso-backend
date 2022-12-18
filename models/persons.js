require("dotenv").config()
const mongoose = require("mongoose")
const URL = process.env.MONGODB_URI

mongoose.connect(URL)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB:", error.message)
    })

const contactSchema = mongoose.Schema({
    name: String,
    number: String,
    date: Date
})

contactSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", contactSchema)