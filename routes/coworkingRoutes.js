const express = require('express')
const router = express.Router()
const { findAllCoworkings, findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking, findAllCoworkingsRawSql, createCoworkingWithImg, updateCoworkingWithImg } = require('../controllers/coworkingControllers')
const { protect, restrictToOwnUser } = require('../controllers/authControllers')
const { Coworking } = require('../db/sequelizeSetup')
const multer = require('../middleware/multer-config');

router
    .route('/')
    // Trouve tout les coworkings
    .get(findAllCoworkings)
    // Ajoute un ou des coworkings
    .post(protect, createCoworking)

router
    .route('/withImg')
    .post(protect, multer, createCoworkingWithImg)

router
    .route('/withImg/:id')
    .put(protect, restrictToOwnUser(Coworking), multer, updateCoworkingWithImg)

router
    .route('/rawsql')
    // Trouve tout les coworkings
    .get(findAllCoworkingsRawSql)

router
    .route('/:id')
    // Trouver les coworkings par id
    .get(findCoworkingByPk)
    // Modifier
    .put(protect, restrictToOwnUser(Coworking), updateCoworking)
    // Supprimer
    .delete(protect, restrictToOwnUser(Coworking), deleteCoworking)

module.exports = router

// protect = t'es pas co, tu peux pas créer de coworking