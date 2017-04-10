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
exports.updateByDeliveryID = (id_delivery,commandUpdate) => {
  return db.Commands.update(commandUpdate.dataValues, { where: { id_delivery: id_delivery }, returning: true});
};
exports.find = () => {
  return db.Commands.findAll();
};

exports.delete = (query) => {
  return db.Commands.destroy({
       where: {
         id_delivery: query.id_delivery
       }
   });

};
//////
exports.findById = (id_delivery) => {
 return db.Commands.findById(id_delivery);
};

exports.findByIdOverrided = (query = {}) => {
  return db.Commands.find({
      where: {
        id_delivery : query
      }
  });
}
