const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const APIError = require('../lib/error');
const commandsService = require('../services/commandsService');

router.post('/',(req, res, next) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
 commandsService.create(req.body)
     .then(command => {

      var today = new Date();
      var updateDate = today.setDate(today.getDate() + 6);
      var delivery_id = "FR";
      // console.log("toto");
      var rndNb = Math.random().toString(36).substring(2,10);
      delivery_id += rndNb;
      //console.log(command);
      command.id_delivery = delivery_id;
      command.progress_update_date = today;
      command.delivery_progress = "Command received";
      command.delivery_date = updateDate;
      command.delivered = false;
      commandsService.updateByID(command.id, command)
        .then(new_command => {
            return res.status(201).json(delivery_id);
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
        res.status(400).json(err.errors[0].message);   // responds with validation errors
      })
      .catch(err => {
        res.status(500).json(err);
     })
  ;
});
/*if (!command) {
   return next(new APIError(404, `id ${req.params.id_command} not found`));
}
  res.status(204).send();
})
.catch(err => {
 res.status(500).send(err);
})
;*/
router.delete('/:id', (req, res) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
   commandsService.delete({id: req.params.id})
    .then(() => {
         res.status(204).send();
     })
     .catch(err => {
         res.status(404).send("coucou");
         console.log("Coucou");
     });

});
router.get('/', (req, res, next) => {
  return commandsService.find()
        .then(commands => {
              console.log("in then");
             if (!commands) {
                return next(new APIError(404, `commands not found`));
             }
             if (req.accepts('application/json')) {
               return res.status(200).send(commands);
             }
           })
       .catch(err => {
         return res.status(500).json(err);
       })
})
router.get('/:id_command', (req, res, next) => {
 if (!req.accepts('application/json')) {
   return next(new APIError(406, 'Not valid type for asked resource'));
  }
  //console.log(req.params.id_command);
  commandsService.findByIdOverrided(req.params.id_command)
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
