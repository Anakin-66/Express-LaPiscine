module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        // Model attributes are defined here
        label: {
            type: DataTypes.STRING,
        },
    }, {
        updatedAt: false,
        createdAt: false
    }
    );
}