const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const APIError = require('../lib/error');
const commandsService = require('../services/commandsService');
//const http = require("http");

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

router.delete('/:id_command', (req, res) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
   commandsService.delete(req.params.id_command)
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
         res.status(500).json(err);
      })
  ;
});
// router.put('/',(req, res, next) => {
//   if (!req.accepts('application/json')) {
//     return next(new APIError(406, 'Not valid type for asked resource'));
//    }
//    var update = req.body;
//    commandsService.findByIdOverrided(update.delivery_id)
//     .then(command => {
//       if (update.delivery_progress){
//         command.delivery_progress = update.delivery_progress;
//         command.progress_update_date = new Date();
//       }
//       if(update.delivered){
//         command.delivered = update.delivered;
//       }
//       commandsService.updateByDeliveryID(command.delivery_id)
//         .then(id => {
//           if(command.delivered){
//             var postData = querystring.stringify({
//                 'tracking' : command.delivery_id,
//                 'delivered': command.delivered
//               });
//             var options = {
//               hostname: 'bio-society.herokuapp.com',
//               port: 80,
//               path: '/notify/colis',
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(postData)
//               }
//             };
//             var req = http.request(options, (res) => {
//               console.log(`STATUS: ${res.statusCode}`);
//               console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//               res.setEncoding('utf8');
//               res.on('data', (chunk) => {
//                 console.log(`BODY: ${chunk}`);
//               });
//               res.on('end', () => {
//                 console.log('No more data in response.');
//               });
//             });
//             req.write(postData);
//             req.end();
//           }
//         })
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     })
// })
module.exports = router;
