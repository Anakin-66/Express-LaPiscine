const { Coworking, User, Review, sequelize } = require('../db/sequelizeSetup')
const { UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize')


const findAllCoworkings = (req, res) => {
    Coworking.findAll({ include: [Review, User] })
        .then((results) => {
            res.json(results)
        })
        .catch((error) => {
            res.status(500).json(error.message)
        })
}

const findAllCoworkingsRawSql = (req, res) => {
    sequelize.query("SELECT name, rating FROM `coworkings` LEFT JOIN `reviews` ON coworkings.id = reviews.CoworkingId",
        { type: QueryTypes.SELECT })
        .then((results) => {
            res.json(results)
        })
        .catch((error) => {
            res.status(500).json(error.message)
        })
}

const findCoworkingByPk = (req, res) => {
    Coworking.findByPk(parseInt(req.params.id))
        .then(coworking => {
            if (coworking) {
                res.json({ message: `Le coworking a été trouvé.`, data: coworking })
            } else {
                res.status(404).json({ message: `Veuillez écrire l'id correspondant du coworking.`, data: coworking })
            }
        })
        .catch((error) => {
            res.status(500).json({ message: `Une erreur est survenue.`, data: error.message })
        });
}

const createCoworking = (req, res) => {

    // Possible car le protect a été fait
    User.findOne({ where: { username: req.username } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: `L'utilisateur n'a pas été trouvé.` })
            }
            const newCoworking = { ...req.body, UserId: user.id }

            // Possible car le protect a été fait
            Coworking.create(newCoworking)
                .then((coworking) => {
                    res.status(201).json({ message: 'Le coworking a bien été créé', data: coworking })
                })
                .catch((error) => {
                    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                        return res.status(400).json({ message: error.message })
                    }
                    res.status(500).json({ message: `Le coworking n'a pas pu être créé`, data: error.message })
                })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

const updateCoworking = (req, res) => {
    Coworking.findByPk(req.params.id)
        .then((result) => {
            if (result) {
                return result.update(req.body)
                    .then(() => {
                        res.status(201).json({ message: 'Le coworking a bien été mis à jour.', data: result })
                    })

            } else {
                res.status(404).json({ message: `Aucun coworking n'a été mis à jour.` })
            }
        })
        .catch(error => {
            if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                return res.status(400).json({ message: error.message })
            }
            res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
        })
};

const deleteCoworking = (req, res) => {
    Coworking.findByPk(req.params.id)
        .then((coworking) => {

            if (coworking) {
                return coworking.destroy()

                    .then(() => {
                        res.json({ mesage: `Le coworking a bien été supprimé.`, data: coworking })
                    })

            } else {

                res.status(404).json({ mesage: `Aucun coworking trouvé.` })
            }
        })
        .catch((error) => {
            if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                res.status(400).json({ message: error.message })
            }
            res.status(500).json({ mesage: `La requête n'a pas aboutie.`, data: error.message })
        })
}

const createCoworkingWithImg = (req, res) => {
    User.findOne({ where: { username: req.username } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: `L'utilisateur n'a pas été trouvé.` })
            }
            const newCoworking = { ...req.body, UserId: user.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }

            Coworking.create(newCoworking)
                .then((coworking) => {
                    res.status(201).json({ message: 'Le coworking a bien été créé', data: coworking })
                })
                .catch((error) => {
                    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                        return res.status(400).json({ message: error.message })
                    }
                    res.status(500).json({ message: `Le coworking n'a pas pu être créé`, data: error.message })
                })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

const updateCoworkingWithImg = (req, res) => {
    Coworking.findByPk(req.params.id)
        .then((result) => {
            if (result) {
                return result.update({ ...req.body, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` })
                    .then(() => {
                        res.status(201).json({ message: 'Le coworking a bien été mis à jour.', data: result })
                    })
            } else {
                res.status(404).json({ message: `Aucun coworking à mettre à jour n'a été trouvé.` })
            }
        })
        .catch(error => {
            if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                return res.status(400).json({ message: error.message })
            }
            res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
        })
}


module.exports = { findAllCoworkings, findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking, findAllCoworkingsRawSql, createCoworkingWithImg, updateCoworkingWithImg }