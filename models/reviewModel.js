module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Review', {
        // Model attributes are defined here
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    msg: `La note ne peut pas être inférieur à 0`,
                    args: [0]
                },
                max: {
                    msg: `La note ne peut pas être supérieur à 5`,
                    args: [5]
                },
            }
        },
    }, 
    );
}