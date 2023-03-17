require('dotenv').config()
const mongoose = require('mongoose')


/*if (process.argv.length<3) {
    console.log('Give password as an argument')
    process.exit(1)
  }*/
  
//const password = process.argv[2]
  
const url = process.env.MONGODB_URI
//`mongodb+srv://vestakulomaa:${password}@cluster0.tctg3hr.mongodb.net/NameApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

console.log("Connecting to database ..")
mongoose.connect(url)
  .then(res => {
    console.log("Connection succesfull!")
  })
  .catch((error) => {
    console.log("Connection error: ", error.message)
  })
  
const nameSchema = new mongoose.Schema({
    name: String,
    number: String,
})

nameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
const Name = mongoose.model('Name', nameSchema)

/*if (process.argv.length == 4) { //add name + number to phonebook
    const new_name = process.argv[2]
    const new_number = process.argv[3]

    const name = new Name({
        name: new_name,
        number: new_number,
      })
      
    name.save().then(result => {
        console.log(`Added ${new_name} number ${new_number} to phonebook!`)
        mongoose.connection.close()
      })
}*/

if (process.argv.length == 3) {

    console.log("Phonebook:")

    Name.find({}).then(result => {
        result.forEach(name => {
          console.log(`${name.name} ${name.number}`)
        })
        mongoose.connection.close()
    })
}
  
module.exports = mongoose.model('Name', nameSchema)