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
        res.status(400).json(err.errors);   // responds with validation errors
      })
      .catch(err => {
        res.status(500).json(err);
     })
  ;
});

router.delete('/:id_delivery', (req, res) => {
  if (!req.accepts('application/json')) {
    return next(new APIError(406, 'Not valid type for asked resource'));
   }
   return commandsService.delete(req.params)
       .then(command => {
         if (!command) {
           console.console.log(command);
            return next(new APIError(404, `id ${req.params.id_delivery} not found`));
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

//GET command by the id_delivery
router.get('/:id_delivery', (req, res, next) => {
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
 router.put('/:id_delivery',(req, res, next) => {
  if (!req.accepts('application/json')) {
     return next(new APIError(406, 'Not valid type for asked resource'));
    }
    var update = req.params;
    var updateBody = req.body;
    console.log(updateBody);
    return commandsService.findByIdOverrided(update.id_delivery)
     .then(command => {
       if(updateBody.delivery_progress){
         command.dataValues.delivery_progress = updateBody.delivery_progress;
           if(updateBody.progress_update_date)
           {
             command.dataValues.progress_update_date = updateBody.progress_update_date != null ? new Date() : updateBody.progress_update_date;
           } if(updateBody.delivered){
             command.dataValues.delivered = updateBody.delivered;
           }
       }

       commandsService.updateByDeliveryID(update.id_delivery,command)
         .then(command => {
           if(command.delivered == true){

             var postData = querystring.stringify({
                 'tracking' : command.id_delivery,
                 'delivered': command.delivered
               });

        const httpTransport = require('http');
        const responseEncoding = 'utf8';
        const httpOptions = {
            hostname: 'bio-society.herokuapp.com',
            port: '80',
            path: '/notify/colis/',
            method: 'POST',
            headers: {"tracking":command.id_delivery,"Content-Type":"application/json; charset=utf-8"}
        };
        httpOptions.headers['User-Agent'] = 'node ' + process.version;
        const request = httpTransport.request(httpOptions, (res) => {
            let responseBufs = [];
            let responseStr = '';

              res.on('data', (chunk) => {
                  if (Buffer.isBuffer(chunk)) {
                      responseBufs.push(chunk);
                  }
                  else {
                      responseStr = responseStr + chunk;
                  }
              }).on('end', () => {
                  responseStr = responseBufs.length > 0 ?
                      Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;

                  callback(null, res.statusCode, res.headers, responseStr);
              });

                  })
                  .setTimeout(0)
                  .on('error', (error) => {
                      callback(error);
                  });
                  console.log(postData);
                  request.write(JSON.stringify(postData));
                  request.end();

              ((error, statusCode, headers, body) => {
                  console.log('ERROR:', error);
                  console.log('STATUS:', statusCode);
                  console.log('HEADERS:', JSON.stringify(headers));
                  console.log('BODY:', body);
              });

               }
               return res.status(204).json();
             })

         })
         .catch(err => {
           res.status(500).json(err);
         })
     });
module.exports = router;
