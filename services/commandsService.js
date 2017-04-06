'use strict'
const db = require('../database');

exports.create = (command) => {
   const model = db.Commands.build(command);
   return model.validate()
       .then(err => {
          if (err) {
              return Promise.reject(err);
          }
          return model.save();
      });
};

exports.delete = (query = {}) => {
  return db.Commands.destroy({
       where: {
         id : query.id
       }

   });
};

//////
exports.findById = (id) => {
 return db.Commands.findById(id);
};
