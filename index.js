require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Name = require('./models/name')

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})


app.get('/api/persons', (req, res) => {
  Name.find({}).then(names => {
    res.json(names)
  })
})

app.get('/info', (req,res) => {
  let date = new Date()
  Name.find({}).then(names => {
    nro_of_people = names.length
    res.send(
      `<div>
        <p> Phonebook has info for ${nro_of_people} people </p>
        <p> ${date} </p>
      </div>`
    )
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  console.log("one person")
  Name.findById(req.params.id)
    .then(name => {
      if (name) {
        res.json(name)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  //const id = Number(req.params.id)
  //persons = persons.filter(person => person.id !== id)
  //res.status(204).end()
  Name.findByIdAndDelete(req.params.id)
    .then(r => {
      res.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res, next) => {
  //let id = Math.floor(Math.random() * 50)
  //while(persons.find(person => person.id === id)) {
  //  id = Math.floor(Math.random() * 50)
  //}
  console.log("app post")

  const person = req.body

  if(!person.name || !person.number) {
    console.log("either name or number was missing")
    res.status(400)
    return res.json({
      error: 'either name or number was missing'
    }).end()
    
  }

  //const person_name = person.name
  //Name.find({person_name}) //ei toimi
  //  .then(console.log("name was already in phonebook"))
    //const id = persons.find(p => p.name === person.name)
    //Name.findByIdAndUpdate(id)
    //  .then(r => {
    //    res.status(204).end()
    //  })
    //  .catch(error => next(error))
  

  //person.id = id

  //persons = persons.concat(person)
  //res.json(person)

  const name = new Name({
    name: person.name,
    number: person.number,
  })

  name.save()
    .then(savedName => {
      res.json(savedName)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  console.log("app put")
  console.log(req.body.number)
  Name.findByIdAndUpdate(req.params.id, {"number": req.body.number}, {new: true})
    .then(returnedPerson => {
      res.json(returnedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})