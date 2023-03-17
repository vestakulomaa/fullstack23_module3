require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Name = require('./mongo.js')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

/*let persons = [
  {
    id: 1,
    name: "Arto Hietala",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]*/

app.get('/api/persons', (req, res) => {
  Name.find({}).then(names => {
    res.json(persons)
  })
})

app.get('/info', (req,res) => {
  let date = new Date()
  res.send(
    `<div>
      <p> Phonebook has info for ${persons.length} people </p>
      <p> ${date} </p>
    </div>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  Name.findById(request.params.id).then(name => {
    response.json(name)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res) => {
  let id = Math.floor(Math.random() * 50)
  while(persons.find(person => person.id === id)) {
    id = Math.floor(Math.random() * 50)
  }

  const person = req.body

  if(!person.name || !person.number) {
    console.log("either name or number was missing")
    res.status(400)
    return res.json({
      error: 'either name or number was missing'
    }).end()
    
  }

  if(persons.find(p => p.name === person.name)) {
    console.log("name was already in phonebook")
    res.status(400)
    return res.json({
      error: 'name is already in the phonebook'
    }).end()
  }

  person.id = id

  persons = persons.concat(person)
  res.json(person)
  
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})