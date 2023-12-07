// on définit le model coworking qui se traduira par une table avec ses champs dans la BDD
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Le nom d'utilisateur est déjà pris."
            },
            validate: {
                len: {
                    msg: "Le nom doit avoir un nombre de caractères compris entre 2 et 15.",
                    args: [2, 15]
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
    );
}