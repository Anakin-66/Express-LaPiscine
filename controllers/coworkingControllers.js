const { Coworking } = require('../db/sequelizeSetup')
const { UniqueConstraintError, ValidationError } = require('sequelize')
const jwt = require('jsonwebtoken')


const findAllCoworkings = (req, res) => {
    Coworking.findAll()
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
    // console.log(req.headers.authorization)
     // A. On vérifie qu'il y a bien un token dans l'en-tête de la requête
    if (!req.headers.authorization) {
        // B. Erreur 401 car l'utilisateur n'est pas authentifié
        return res.status(401).json({ message: `Vous n'êtes pas authentifié.` })
    }
    // C. On récupère le token uniquement, on enlève "Bearer "
    const token = req.headers.authorization.split(' ')[1]

    if (token) {
        try {
            // D. On décode le token à l'aide de la même clé secrète qui a servi à générer le token
            const decoded = jwt.verify(token, SECRET_KEY);
            console.log(decoded);
        } catch (error) {
            // E. La vérification a lévé une erreur, le return met fin au controller, donc pas de création de Coworking
            return res.status(403).json({ message: `Le token n'est pas valide.` })
        }
    }
    const newCoworking = { ...req.body }

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


module.exports = { findAllCoworkings, findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking }