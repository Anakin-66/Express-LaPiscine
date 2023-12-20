// module.exports = (sequelize, DataTypes, Coworking, Customer) => {
//     return sequelize.define('Registration', {
//         CoworkingId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: Coworking,
//                 key: 'id'
//             }
//         },
//         CustomerId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: Customer,
//                 key: 'id'
//             }
//         },
//         payment: {
//             type: DataTypes.STRING
//         }
//     }
//     );
// }