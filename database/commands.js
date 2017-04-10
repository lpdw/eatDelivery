'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Commands', {
       id_delivery: {
          type: DataTypes.STRING,
       },
       address: {
           type: DataTypes.STRING,
           validate: {notEmpty: {msg: "Missing address"}},
           allowNull: false
       },
       firstname: {
           type: DataTypes.STRING,
           validate: {notEmpty: {msg: "Missing name"}},
           allowNull: false
       },
       lastname: {
          type: DataTypes.STRING,
          vaidate: {notEmpty: {msg: "Missing last name"}},
          allowNull: false
       },
       phone_number: {
          type: DataTypes.STRING,
          vaidate: {notEmpty: {msg: "Missing phone number"}},
          allowNull: false
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
