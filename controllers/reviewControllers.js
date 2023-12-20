const { Review, User } = require('../db/sequelizeSetup')
const { ValidationError } = require('sequelize')


const findAllReviews = (req, res) => {
    Review.findAll({ include: User})
        .then((results) => {
            res.json(results)
        })
        .catch((error) => {
            res.status(500).json(error.message)
        })
}

const findReviewByPk = (req, res) => {
    Review.findByPk(parseInt(req.params.id))
        .then(review => {
            if (review) {
                res.json({ message: `Le commentaire a été trouvé.`, data: review })
            } else {
                res.status(404).json({ message: `Veuillez écrire l'id correspondant au commentaire.`, data: review })
            }
        })
        .catch((error) => {
            res.status(500).json({ message: `Une erreur est survenue.`, data: error.message })
        });
}

const createReview = (req, res) => {
    User.findOne({ where: { username: req.username } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: `Utilisateur non trouvé.` })
            }
            return Review.create({ ...req.body, UserId: user.id })
                .then(result => {
                    res.json({ message: `Commentaire créé.`, data: result })
                })
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message })
            }
            res.status(500).json({ message: error.message })
        })
}

const updateReview = (req, res) => {
    Review.findByPk(req.params.id)
        .then((result) => {
            if (result) {
                return result.update(req.body)
                    .then(() => {
                        res.status(201).json({ message: 'Le commentaire a bien été mis à jour.', data: result })
                    })

            } else {
                res.status(404).json({ message: `Aucun commentaire n'a été mis à jour.` })
            }
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message })
            }
            res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
        })
};

const deleteReview = (req, res) => {
    Review.findByPk(req.params.id)
    .then((review) => {
        if (review) {
            return review.destroy()

                .then(() => {
                    res.json({ mesage: `Le commentaire a bien été supprimé.`, data: review })
                })

        } else {

            res.status(404).json({ mesage: `Aucun commentaire trouvé.` })
        }
    })
    .catch((error) => {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.message })
        }
        res.status(500).json({ mesage: `La requête n'a pas aboutie.`, data: error.message })
    })
}







module.exports = { findAllReviews, findReviewByPk, createReview, updateReview, deleteReview }