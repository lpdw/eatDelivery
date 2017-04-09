var Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
var APIError = require('../lib/error');
const commandsService = require('../services/commandsService');

router.post('/',(req, res) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
 return commandsService.create(req.body)
     .then(command => {
       if (req.accepts('application/json')) {
         return res.status(201).send(command);
       }
     })
     .catch(Sequelize.ValidationError, err => {
              res.status(400).send(err);   // responds with validation errors
      })
      .catch(err => {
        res.status(500).send(err);
     })
  ;
});

router.delete('/:id_command', (req, res) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
   commandsService.delete(req.params)
       .then(command => {
         if (!command) {
            return next(new APIError(404, `id ${req.params.id_command} not found`));
         }
           res.status(204).send();
       })
       .catch(err => {
          res.status(500).send(err);
       })
   ;
});

router.get('/:id_command', (req, res, next) => {
 if (!req.accepts('application/json')) {
   return next(new APIError(406, 'Not valid type for asked resource'));
  }
  commandsService.findByIdOverrided(req.params.id)
      .then(command => {
       if (!command) {
          return next(new APIError(404, `id ${req.params.id_command} not found`));
       }
       if (req.accepts('application/json')) {
         return res.status(200).send(command);
       }
      })
      .catch(err => {
         res.status(500).send(err);
      })
  ;
});

module.exports = router;
