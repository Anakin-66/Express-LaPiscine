const { User, Role } = require('../db/sequelizeSetup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../configs/tokenData')

const rolesHierarchy = {
    edit: ["edit"],
    admin: ["admin", "edit"],
    superadmin: ["superadmin", "admin", "edit"]
}

// Middleware login
const login = (req, res) => {
    // A. On vérifie que l'utilisateur qui tente de se connecter existe bel et bien dans notre BDD
    User.scope('withPassword').findOne({ where: { username: req.body.username } })
        .then((result) => {
            // B. Si l'utilisateur n'existe pas, on renvoie une réponse erreur Client
            if (!result) {
                return res.status(404).json({ message: `Le nom d'utilisateur n'existe pas.` })
            }
            // C. On vérifie que le mot de passe fourni pour se connecter corresponde au mot de passe de l'utilisateur dans la BDD
            bcrypt.compare(req.body.password, result.password)
                .then((isValid) => {
                    // D. Si le mot de passe n'est pas le bon, on renvoie une erreur Client, non authentifié
                    if (!isValid) {
                        return res.status(401).json({ message: `Le mot de passe n'est pas valide.` })
                    }
                    // E. On génère un token qui servira à vérifier dans chaque endpoint où ce sera nécessaire si l'utilisateur peut consommer la ressource. Dans l'état actuel, le token est utilisé dans le POST COWORKINGS
                    const token = jwt.sign({
                        data: result.username
                    }, SECRET_KEY, { expiresIn: '1h' });

                    res.cookie('coworkingapi_jwt', token)
                    res.json({ message: `Login réussi`, data: token })
                })
                .catch(error => {
                    console.log(error.message);
                })
        })
        .catch((error) => {
            res.status(500).json({ data: error.message })
        })
}

// Middleware pour l'authentification 
const protect = (req, res, next) => {
    if (!req.headers.authorization) {
        // B. Erreur 401 car l'utilisateur n'est pas authentifié
        return res.status(401).json({ message: `Vous n'êtes pas authentifié.` })
    }
    // C. On récupère le token uniquement, on enlève "Bearer "
    const token = req.headers.authorization.split(' ')[1]

    // if (!req.cookies.coworkingapi_jwt) {
    //     return res.status(401).json({ message: `Vous n'êtes pas authentifié.` })
    // }

    // const token = req.cookies.coworkingapi_jwt

    if (token) {
        try {
            // D. On décode le token à l'aide de la même clé secrète qui a servi à générer le token
            const decoded = jwt.verify(token, SECRET_KEY);
            req.username = decoded.data
            console.log(decoded);
            next()
        } catch (error) {
            // E. La vérification a lévé une erreur, le return met fin au controller, donc pas de création de Coworking
            return res.status(403).json({ message: `Le token n'est pas valide.` })
        }
    }
}

// Middleware pour les droits
const restrict = (labelRole) => {
    return (req, res, next) => {
        User.findOne({
            where: {
                username: req.username
            }
        })
            .then(user => {
                Role.findByPk(user.RoleId)
                    .then(role => {
                        if (rolesHierarchy[role.label].includes(labelRole)) {
                            next()
                        } else {
                            res.status(403).json({ message: `Droits insuffisants` })
                        }
                    })
                    .catch(error => {
                        console.log(error.message)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }
}

// Middleware propre aux utilisateurs
const restrictToOwnUser = (model) => {
    return (req, res, next) => {
        User.findOne(
            {
                where:
                    { username: req.username }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `Pas d'utilisateur trouvé.` })
                }
                // on teste d'abord si le user est admin
                return Role.findByPk(user.RoleId)
                    .then(role => {
                        // role.label est le rôle issu du token 
                        if (rolesHierarchy[role.label].includes('admin')) {
                            return next()
                        }
                        model.findByPk(req.params.id)
                            .then(ressource => {
                                if (!ressource) return res.status(404).json({ message: `La ressource n'existe pas.` })
                                if (user.id === coworking.UserId) {
                                    next()
                                } else {
                                    res.status(403).json({ message: `Vous n'êtes pas l'auteur de la ressource.` })
                                }
                            })
                            .catch(error => {
                                return res.status(500).json({ message: error.message })
                            })
                    })
            })
            .catch(error => console.log(error.message))
    }
}

// Middleware pour éviter qu'un rôle qui est dans la même hiérachie qu'un autre puisse modifier son contenu (mdp ou username) 
const correctUser = (req, res, next) => {
    User.findOne({ where: { username: req.username } })
        .then(authUser => {
            console.log(authUser.id, parseInt(req.params.id))
            if (authUser.id === parseInt(req.params.id)) {
                next()
            } else {
                res.status(403).json({ message: "Droits insuffisants." })
            }
            // Role.findByPk(authUser.RoleId)
            //     .then(role => {
            //         // if (rolesHierarchy[role.label].includes('admin')) {
            //         //     return next()
            //         // }

            //         if (authUser.id === req.params.id) {
            //             next()
            //         } else {
            //             res.status(403).json({ message: "Droits insuffisants." })
            //         }
            //     })
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
    // if (result.id !== req.params.id) {
    //     return res.status(403).json({ message: 'Droits insuffisants.' })
    // }
}

module.exports = { login, protect, restrict, restrictToOwnUser, correctUser }