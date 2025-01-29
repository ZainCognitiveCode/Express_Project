'use strict';
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');


const User = sequelize.define("User",{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  },
  phoneNumber : {
    type: DataTypes.STRING
  }
});

module.exports = User;


