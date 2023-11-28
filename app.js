// CTRL + C pour redémarrer le serveur
// "scripts": {
// "start": "npx nodemon app.js"
//   }, pour executer de façon plus pratique nodemon

const express = require('express')
// On construit une instance d'express
const app = express()
const port = 3000

const mockCoworkings = require('./mock-coworking')

const arrUsers = [
    {   id: 12,
        name: "Nathan",
        age: 24
    },
    {   id: 13,
        name: "Bob",
        age: 26
    },
    {   id: 14,
        name: "Jack",
        age: 31
    },
    
]

const logger = (req, res, next) => {

    const now = new Date()
    const hours = now.getHours();
    const minutes = now.getMinutes();
    console.log(`${hours}h${minutes < 10 ? '0' + minutes : minutes} - ${req.url} DANS LOGGER`);
    next()

}

app.use(logger)


// Récupère le tableau en entier avec une forEach
app.get('/names', (req, res) => {
    let sentence = ""
    arrUsers.forEach(obj => {
        sentence+= obj.name + " "
    });
    res.send(sentence)
})

// Param d'URL
app.get('/names/:id', (req, res) => {

    let urlId = parseInt(req.params.id)

    // for (let i = 0; i < arrUsers.length; i++) {
    //     const element = arrUsers[i]
    //     if (element.id === parseInt(req.params.id)) {
    //         result = arrUsers[i].name
    //         // pour arrêter la boucle
    //         break; 
    //     }
    // }
    let result = arrUsers.find(el => el.id === urlId)
    result = result ? result.name : "not found";

    res.send(result)

    })

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