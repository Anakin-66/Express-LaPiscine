// module.exports = (sequelize, DataTypes) => {
//     return sequelize.define('Customer', {
//         firstname: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         lastname: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: {
//                 msg: "Le mail est déjà pris."
//             },
//         },
//     }
//     );
// }