// B. On importe le gabarit du Model Coworking défini dans le fichier ./models/coworking'
const UserModel = require('../models/userModel')
const CoworkingModel = require('../models/coworkingModel')
const RoleModel = require('../models/roleModel')
const ReviewModel = require('../models/reviewModel')
const { Sequelize, DataTypes } = require('sequelize');
const { setCoworkings, setUsers, setRoles, setReviews } = require('./setDataSample')
// const {  setCustomers, setRegistrations } = require('./setDataSample')


// A. On créé une instance de bdd qui communique avec Xampp 
const sequelize = new Sequelize('bordeaux_coworkings', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

// C. On instancie un Model qui permettra d'interpréter le Javascript avec la Table SQL correspondante
const Coworking = CoworkingModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
const Role = RoleModel(sequelize, DataTypes)
const Review = ReviewModel(sequelize, DataTypes)
// const Customer = customerModel(sequelize, DataTypes)
// const Registration = registrationModel(sequelize, DataTypes, Coworking, Customer)

// A faire sur la fin
Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Coworking)
Coworking.belongsTo(User)

User.hasMany(Review)
Review.belongsTo(User)

Coworking.hasMany(Review)
Review.belongsTo(Coworking)

// Coworking.belongsToMany(Customer, { through: Registration });
// Customer.belongsToMany(Coworking, { through: Registration });

// D. On synchronise la BDD avec les models défini dans notre API
sequelize.sync({ force: true })
    .then(() => {
        setCoworkings(Coworking)
        setUsers(User)
        setRoles(Role)
        setReviews(Review)
    })
    .catch(error => {
        console.log(error)
    })

// sequelize.sync({ force: true })
//     .then(() => {
//         // setCoworkings(Coworking)
//         setUsers(User)
//         setRoles(Role)
//             .then(async () => {
//                 await setRoles(Role)
//                 await setUsers(User)
//                 await setCoworkings(Coworking)
//                 await setCustomers(Customer)
//                 setRegistrations(Registration)
//             })
//             .catch(error => {
//                 console.log(error)
//             })


                sequelize.authenticate()
                    .then(() => console.log('La connexion à la base de données a bien été établie.'))
                    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


                module.exports = { sequelize, Coworking, User, Role, Review }