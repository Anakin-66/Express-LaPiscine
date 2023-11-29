const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3000

let mockCoworkings = require('./mock-coworking')

// Middleware qui me permet d'intepreter le corps de ma requête (req.body) en format json
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Hello World !')
})

app.get('/api/coworkings', (req, res) => {
    res.send(mockCoworkings)
})

app.get('/api/coworkings/:id', (req, res) => {

    let result = mockCoworkings.find (el => el.id === parseInt(req.params.id))

    result = result ? result.name : "not found";

    res.send(result)
})
// Créer
app.post('/api/coworkings', function (req, res) {
    console.log(req.body)

    // Ajouter le coworking dans le tableau, en automatisant la génération d'un id
    // let coworking = req.body

    // incrémentation à partir du dernier à élément du tableau
    const newId = mockCoworkings[mockCoworkings.length -1].id + 1
    // let coworking = {id: newId, superficy : req.body.superficy, capacity : req.body.capacity, name: req.body.name}
    
    // ... SPREAD OPERATOR
    let coworking = {id: newId, ...req.body}
    mockCoworkings.push(coworking)

    // On renvoie un objet qui contient les proriétés message et data
    // message: `Le coworking a bien été ajouté`
    let success = {message: `Le coworking a bien été ajouté`, data: coworking}
    res.json(success);

  });
// Modifier
app.put('/api/coworkings/:id', function (req, res) {
    const coworking = mockCoworkings.find((el) => el.id === parseInt(req.params.id))

    let result;
    if (coworking) {
        coworking.superficy = req.body.superficy
         result = { message: `Coworking modifié`, data: coworking }
        
    } else {
         result = { message: `Aucun coworking trouvé avec l'ID ${req.params.id}`}
    }
    res.json(result);
});
// Supprimer
app.delete('/api/coworkings/:id', function (req, res) {
    const coworking = mockCoworkings.find((el) => el.id === parseInt(req.params.id))

    let result;
    if (coworking) {
        mockCoworkings = mockCoworkings.filter (el => el.id !== coworking.id)
         result = { message: `Coworking supprimé`, data: coworking }
        
    } else {
         result = { message: `Aucun coworking trouvé avec l'ID ${req.params.id}`}
    }
    res.json(result);
  });

app.listen(port, () => {
    console.log(`Le port en train d'écouter est le port : ${port}`);
})