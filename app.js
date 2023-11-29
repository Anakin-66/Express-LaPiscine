// CTRL + C pour redémarrer le serveur
// "scripts": {
// "start": "npx nodemon app.js"
//   }, pour executer de façon plus pratique nodemon

const express = require('express')
// On construit une instance d'express
const app = express()
const port = 3000

const mockCoworkings = require('./mock-coworking')


const logger = (req, res, next) => {

    const now = new Date()
    const hours = now.getHours();
    const minutes = now.getMinutes();
    console.log(`${hours}h${minutes < 10 ? '0' + minutes : minutes} - ${req.url} DANS LOGGER`);
    next()

}

app.use(logger)


app.get('/api/coworkings', (req, res) => {
    res.send(`Il y a ${mockCoworkings.length} coworkings dans la liste`)
})

app.get('/api/coworkings/:id', (req, res) => {

    let result = mockCoworkings.find (el => el.id === parseInt(req.params.id))

    result = result ? result.name : "not found";

    res.send(result)
})





app.listen(port, () => {
    console.log(`Le port en train d'écouter est le port : ${port}`);
})