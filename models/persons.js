require('dotenv').config()
const mongoose = require('mongoose')
const URL = process.env.MONGODB_URI

mongoose.connect(URL)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(value) {
        if (typeof value !== 'string') return false
                
        const parts = value.split('-')
        if (parts.length !== 2) return false
                
        const [firstPart, secondPart] = parts
        if (firstPart.length !== 2 && firstPart.length !== 3 || !/^\d+$/.test(secondPart)) {
          return false
        }
                
        return true
      },
      message: 'Invalid phone number format'
    },
    minLength: 8,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)