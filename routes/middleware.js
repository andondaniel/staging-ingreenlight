'use strict';

/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var log = require('blikk-logjs')('middleware');
var rolesHelper = require('../lib/rolesHelper');
var _ = require('underscore');
var minimatch = require('minimatch');

exports.logRequest = function(req, res, next){
  log.info({req: req});
  next();
};

exports.logError = function(err, req, res, next){
  log.error({err: err});
  next(err);
};

/**
  Initialises the standard view locals
  
  The included layout depends on the navLinks array to generate
  the navigation in the header, you may wish to change this array
  or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
  
  var locals = res.locals;
  
  locals.navLinks = [
    { label: 'Home',    key: 'home',    href: '/' }
  ];
  
  locals.user = req.user;

  // Expose permissions to keystone
  res.locals.testAA = 'Hello';
  if(req.user){
    // TODO: Remove these user props
    locals.user.hiddenLists = rolesHelper.hiddenLists[req.user.role] || [];
    locals.user.hiddenNavSections = rolesHelper.hiddenNavSections[req.user.role] || [];
    locals.user.readOnlyLists = rolesHelper.readOnlyLists[req.user.role] || [];
    locals.authorization = {};
    locals.authorization.isViewer = (req.user.role === 'Viewer');
    locals.authorization.hiddenLists = rolesHelper.hiddenLists[req.user.role] || [];
    locals.authorization.hiddenNavSections = rolesHelper.hiddenNavSections[req.user.role] || [];
    locals.authorization.readOnlyLists = rolesHelper.readOnlyLists[req.user.role] || [];
  }

  next();
  
};


/**
  Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
  
  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };
  
  res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
  
  next();
  
};


/**
  Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'Please sign in to access this page.');
    res.redirect('/keystone/signin');
  } else {
    next();
  }
};

exports.authorizeRoles = function(req, res, next) {

  if(!req.user) return next();

  // Viewers can only GET resources
  if(req.user.role === 'Viewer')
    if(req.method !== 'GET' || req.path.indexOf('delete') > -1) {
    log.error({req: req, user: req.user}, 'Unauthorized Access')
    return res.render('errors/404');
  }

  next();
};
