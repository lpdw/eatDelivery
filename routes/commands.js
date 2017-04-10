var Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
var APIError = require('../lib/error');
const commandsService = require('../services/commandsService');

router.post('/',(req, res, next) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
 commandsService.create(req.body)
     .then(command => {
       console.log("after then");
      var today = new Date();
      var updateDate = today.setDate(today.getDate() + 6);
      var id = "FR";
      // console.log("toto");
      var rndNb = Math.random().toString(36).substring(2,10);
      id += rndNb;
      //console.log(command);
      command.id_command = id;
      command.progress_update_date = today;
      command.delivery_progress = "Command received";
      command.delivery_date = updateDate;
      command.update(command)
        .then(command => {
          return res.status(201).json(command);
        } )
        .catch(err => {
          res.status(500).json(err);
        })
      //console.log(command);
      // commandsService.update(command)
      //     .then(command => {return res.status(201).json(command);} )
      //     .catch(err => { res.status(500).json(err); })

      })
     .catch(Sequelize.ValidationError, err => {
        res.status(400).json(err);   // responds with validation errors
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
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
         return res.status(200).json(command);
       }
      })
      .catch(err => {
         res.status(500).send(err);
      })
  ;
});
//TODO Another route to set command status ?
module.exports = router;
