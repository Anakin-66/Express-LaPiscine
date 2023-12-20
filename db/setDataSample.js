const mockCoworkings = require('./mock-coworkings')
const mockUsers = require('./mock-users')
const bcrypt = require('bcrypt')

const setCoworkings = (Coworking) => {
    mockCoworkings.forEach((element) => {
        const newCoworking = { ...element, id:null }
        Coworking.create(newCoworking)
            .then(() => { })
            .catch((error) => {
                console.log(error.message)
            })
    })
}
// Pour le many to many
// const setCoworkings = (Coworking) => {
//     return Promise.all(mockCoworkings.map((element) => {
//         const newCoworking = { ...element, id: null }
//         return Coworking.create(newCoworking)
//             .then(() => { })
//             .catch((error) => {
//                 console.log(error.message)
//             })
//     }))
// }

const setUsers = (User) => {
    mockUsers.forEach(user => {
        bcrypt.hash(user.password, 10)
            .then(hashResult => {
                User.create({ ...user, password: hashResult })
                    .then(() => { })
                    .catch((error) => {
                        console.log(error.message)
                    })
            })
    })

};

// Pour le many to many
// const setUsers = (User) => {
//     return Promise.all(mockUsers.map(user => {
//         return bcrypt.hash(user.password, 10)
//             .then(hashResult => {
//                 return User.create({ ...user, password: hashResult })
//                     .then(() => { })
//                     .catch((error) => {
//                         console.log(error.message)
//                     })
//             })
//     }))
// }

const setRoles = (Role) => {
    Role.create({ label: "superadmin" })
    Role.create({ label: "admin" })
    Role.create({ label: "edit" })
}

const setReviews = (Review) => {
    Review.create({ content: "mon commentaire", rating: 3 })
}

// const setCustomers = (Customer) => {
//     return Promise.all([
//         Customer.create({ firstname: "Olivier", lastname: "Macdonald", gender: "male", age: 70, email: "olivier.macdonald@example.com" }),
//         Customer.create({ firstname: "Dave", lastname: "Fisher", gender: "male", age: 22, email: "dave.fisher@example.com" }),
//         Customer.create({ firstname: "Lillie", lastname: "Franklin", gender: "female", age: 30, email: "lillie.franklin@example.com" }),
//         Customer.create({ firstname: "Leroy", lastname: "Ramirez", gender: "male", age: 39, email: "leroy.ramirez@example.com" }),
//         Customer.create({ firstname: "Victoria", lastname: "Rocha", gender: "female", age: 52, email: "victoria.rocha@example.com" }),
//         Customer.create({ firstname: "Lucas", lastname: "Christiansen", gender: "male", age: 28, email: "lucas.christiansen@example.com" }),
//         Customer.create({ firstname: "Gabriel", lastname: "Nieto", gender: "male", age: 21, email: "gabriel.nieto@example.com" }),
//         Customer.create({ firstname: "Ellen", lastname: "Arola", gender: "female", age: 59, email: "ellen.arola@example.com" }),
//         Customer.create({ firstname: "Augustin", lastname: "Da Silva", gender: "male", age: 34, email: "augustin.dasilva@example.com" }),
//         Customer.create({ firstname: "Giray", lastname: "Balci", gender: "male", age: 51, email: "giray.balci@example.com" })
//     ])
// }

// const setRegistrations = (Registration) => {
//     Registration.create({ CustomerId: 1, CoworkingId: 2, payment: "monthly" })
//     Registration.create({ CustomerId: 2, CoworkingId: 2, payment: "monthly" })
//     Registration.create({ CustomerId: 2, CoworkingId: 3, payment: "yearly" })
//     Registration.create({ CustomerId: 4, CoworkingId: 4, payment: "yearly" })
//     Registration.create({ CustomerId: 5, CoworkingId: 3, payment: "yearly" })
//     Registration.create({ CustomerId: 3, CoworkingId: 2, payment: "monthly" })
//     Registration.create({ CustomerId: 1, CoworkingId: 7, payment: "yearly" })
//     Registration.create({ CustomerId: 7, CoworkingId: 6, payment: "yearly" })
//     Registration.create({ CustomerId: 7, CoworkingId: 7, payment: "yearly" })
//     Registration.create({ CustomerId: 7, CoworkingId: 8, payment: "monthly" })
//     Registration.create({ CustomerId: 7, CoworkingId: 9, payment: "yearly" })
//     Registration.create({ CustomerId: 5, CoworkingId: 6, payment: "monthly" })
//     Registration.create({ CustomerId: 9, CoworkingId: 3, payment: "yearly" })
// }


module.exports = { setCoworkings, setUsers, setRoles, setReviews }
// module.exports = { setCustomers, setRegistrations }