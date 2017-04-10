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
exports.updateByID = (id, command) => {
  return db.Commands.update(command.dataValues, { where: { id: id }, returning: true});
};
exports.find = () => {
  return db.Commands.findAll();
};

exports.delete = (query = {}) => {
  return db.Commands.destroy({
       where: {
         query
       }
   });
   console.log(query);
};
//////
exports.findById = (id_command) => {
 return db.Commands.findById(id_command);
};

exports.findByIdOverrided = (query = {}) => {
  return db.Commands.find({
      where: {
        id_command : query.id_command
      }
  });
}
