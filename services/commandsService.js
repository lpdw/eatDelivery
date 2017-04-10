'use strict'
const db = require('../database');

exports.create = (command) => {
   const model = db.Commands.build(command);
   return model.validate()
       .then(err => {
          if (err) {
              return Promise.reject(err);
          }
          console.log("Yo");
          return model.save();
      });
};
exports.update = (command) => {
  console.log('before find');
  var model = db.Commands.findById(command.id);
  return model.update()
  console.log("after find");
  //console.log(model);
  //return model.update(command);
};

exports.delete = (query = {}) => {
  return db.Commands.destroy({
       where: {
         id_command : query.id_command
       }

   });
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
