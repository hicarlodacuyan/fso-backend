const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const URL = `mongodb+srv://hicarlodacuyan:${password}@cluster0.eaa8nwg.mongodb.net/phonebook?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  mongoose.connect(URL).then((result) => {
    console.log("searching for contacts");

    Contact.find({}).then((result) => {
      result.forEach((contact) => {
        console.log(contact);
      });

      mongoose.connection.close();
    });
  });
} else {
  mongoose
    .connect(URL)
    .then((result) => {
      console.log("adding new contact");

      const contact = new Contact({
        name,
        number,
      });

      return contact.save();
    })
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);

      return mongoose.connection.close();
    });
}
