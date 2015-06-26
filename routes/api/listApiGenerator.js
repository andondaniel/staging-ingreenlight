'use strict';

var Promise = require('bluebird');
var express = require('express');

var ApiGenerator = function(){
};

ApiGenerator.prototype.generateApiForList = function(list) {
  var router = express.Router();
  var log = require('blikk-logjs')(list.key.toLowerCase() + '-api');

  var model = list.model;
  Promise.promisifyAll(model);
  Promise.promisifyAll(model.prototype);

  router.post('/', function(req, res){
    var record = new model(req.body);
    record.saveAsync().spread(function(newRecord){
      log.info({record: newRecord, user: req.user}, 'Created new ' + list.singular);
      res.send(newRecord);
    }).catch(function(err){
      res.status(400).send(err);
      log.error({err: err});
    });
  });

  router.get('/:id', function(req, res){
    model.findOneAsync({_id: req.params.id}).then(function(record){
      return (record) ? res.send(record) : res.status(404).end();
    }).catch(function(err){
      log.error({err: err});
      res.status(500).send(err);
    });
  });

  router.put('/:id', function(req, res){
    model.findOneAsync({_id: req.params.id}).then(function(record){
      if(!record) { return res.sendStatus(404); }
      record.set(req.body);
      return record.saveAsync().spread(function(newRecord){
        log.info({record: newRecord, user: req.user}, 'Updated ' + list.singular);
        return res.send(newRecord);
      });
    }).catch(function(err){
      log.err({err: err});
      res.status(500).send(err);
    });
  });  

  router.delete('/:id', function(req, res){
    model.findOneAndRemoveAsync({_id: req.params.id}).then(function(record){
      if (!record) return res.sendStatus(404);
      log.info({record: record, user: req.user}, 'Deleted ' + list.singular);
      res.send(record);
    }).catch(function(err){
      log.error({err: err});
      res.status(500).send(err);
    });
  });




  return router;
};


module.exports = new ApiGenerator();