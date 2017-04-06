var express = require('express');
var router = express.Router();
var APIError = require('../lib/error');

router.post('/',(req, res) => {
 return SongService.create(req.body)
     .then(command => {
       if (req.accepts('application/json')) {
         return res.status(201).send(command);
       }
     })
     .catch(err => {
        res.status(500).send(err);
     })
  ;
});

router.delete('/:id', (req, res) => {
   commandService.delete(req.params)
       .then(command => {
           res.status(204).send();
       })
   ;
});

router.get('/:id', (req, res, next) => {
 if (!req.accepts('application/json')) {
   return next(new APIError(406, 'Not valid type for asked resource'));
  }
  commandService.findById(req.params.id)
      .then(command => {
       if (!command) {
          return next(new APIError(404, `id ${req.params.id} not found`));
       }
       if (req.accepts('application/json')) {
         return res.status(201).send(command);
       }
      })
      .catch(next)
      ;
});

module.exports = router;
