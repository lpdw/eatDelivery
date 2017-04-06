'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Commands', {
       id: {
          type: DataTypes.STRING,
       },
       address: {
           type: DataTypes.STRING,
           validate: {notEmpty: {msg: "-> Missing address"}}
       },
       delivery_date: {
           type: DataTypes.DATE,
       },
       delivery_progress: {
           type: DataTypes.STRING,
       },
       progress_update_date: {
           type: DataTypes.DATE,
       },
       error: {
           type: DataTypes.BOOLEAN,
       },
       error_descripion: {
           type: DataTypes.STRING,
       },
   });
};
