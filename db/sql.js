const sequelize = require('../config/database');

function connectToSql() {
    try {
        sequelize.authenticate().then(
          console.log('Connection has been established successfully.')
        )
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }

}
module.exports = connectToSql;
