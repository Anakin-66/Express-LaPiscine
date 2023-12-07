const express = require('express')
const router = express.Router()
const { Coworking } = require('../db/sequelizeSetup')
const { findAllCoworkings, findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking } = require ('../controllers/coworkingControllers')

router
    .route('/')
    // Trouve tout les coworkings
    .get(findAllCoworkings) 
    // Ajoute un ou des coworkings
    .post(createCoworking)

router
    .route('/:id')
    // Trouver les coworkings par id
    .get(findCoworkingByPk)
    // Modifier
    .put(updateCoworking)
    // Supprimer
    .delete(deleteCoworking)

module.exports = router