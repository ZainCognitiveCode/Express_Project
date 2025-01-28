'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Add username column
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // Add password column (correcting the typo from passord)
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add resetPasswordToken column
    await queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add resetPasswordExpires column
    await queryInterface.addColumn('Users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add phoneNumber column
    await queryInterface.addColumn('Users', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove firstName column
    await queryInterface.removeColumn('Users', 'firstName');

    // Remove lastName column
    await queryInterface.removeColumn('Users', 'lastName');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove id column
    await queryInterface.removeColumn('Users', 'id');

    // Remove username column
    await queryInterface.removeColumn('Users', 'username');

    // Remove password column
    await queryInterface.removeColumn('Users', 'password');

    // Remove resetPasswordToken column
    await queryInterface.removeColumn('Users', 'resetPasswordToken');

    // Remove resetPasswordExpires column
    await queryInterface.removeColumn('Users', 'resetPasswordExpires');

    // Remove phoneNumber column
    await queryInterface.removeColumn('Users', 'phoneNumber');

    // Add firstName column back (for rollback)
    await queryInterface.addColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add lastName column back (for rollback)
    await queryInterface.addColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

