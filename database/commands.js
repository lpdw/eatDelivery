'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Commands', {
       id_command: {
          type: DataTypes.STRING,
       },
       address: {
           type: DataTypes.STRING,
           validate: {notEmpty: {msg: "-> Missing address"}}
       },
       name: {
           type: DataTypes.STRING,
           validate: {notEmpty: {msg: "-> Missing name"}}
       },
       lastname: {
          type: DataTypes.STRING,
          vaidate: {notEmpty: {msg: "-> Missing last name"}}
       },
       phone_number: {
          type: DataTypes.STRING,
          vaidate: {notEmpty: {msg: "-> Missing phone number"}}
       },
       delivery_date: {
           type: DataTypes.DATE
       },
       delivery_progress: {
           type: DataTypes.STRING
       },
       progress_update_date: {
           type: DataTypes.DATE
       },
       delivered:{
         type: DataTypes.BOOLEAN
       },
       error: {
           type: DataTypes.BOOLEAN
       },
       error_descripion: {
           type: DataTypes.STRING
       },
   });
};
