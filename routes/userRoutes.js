const express = require('express')
const router = express.Router()
const { User } = require('../db/sequelizeSetup')
const { findAllUsers, findUserByPk, createUser, updateUser, deleteUser } = require('../controllers/userControllers')
const { login } = require ('../controllers/authControllers')

router
    .route('/')
    .get(findAllUsers)
    .post(createUser)


router
    .route('/login')
    .post(login)
router
    .route('/:id')
    .get(findUserByPk)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router