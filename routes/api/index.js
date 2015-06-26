'use strict';

var keystone = require('keystone');
var express = require('express');
var auth = require('basic-auth');
var listApiGenerator = require('./listApiGenerator');
var log = require('blikk-logjs')('api');
var User = keystone.list('User').model;
var router = express.Router();


var authMiddleWare = function(req, res, next){
  var user = auth(req);
  if(!user){
    return res.sendStatus(401);
  }
  User.findOne({apiToken: user.name}, function(err, user){
    if(err) {
      log.error({err: err});
      return res.sendStatus(500);
    } else if(user){
      req.user = user;
      next();
    } else {
      res.sendStatus(401);
    }
  });
};

router.use('/articles', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('Article')));

router.use('/contentPieces', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('ContentPiece')));

router.use('/contributions', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('Contribution')));

router.use('/organizations', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('Organization')));

router.use('/people', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('Person')));

router.use('/projects', authMiddleWare,
  listApiGenerator.generateApiForList(keystone.list('Project')));

module.exports = router;
