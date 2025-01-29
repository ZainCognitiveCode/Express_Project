'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Users','firstName',{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
   });
   await queryInterface.addColumn('Users','lastName',{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
   });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('Users','firstName');
   await queryInterface.removeColumn('Users','lastName');
  }
};
