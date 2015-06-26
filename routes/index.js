'use strict';

/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var log = require('blikk-logjs')('middleware');
var keystone = require('keystone');
var middleware = require('./middleware');
// var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.logRequest);
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.authorizeRoles);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function(err, req, res, next) {
  log.error({req: req}, '404 Not found');
  res.notfound();
});
 
// Handle other errors
keystone.set('500', function(err, req, res, next) {
  log.error({err: err});
  res.err(err);
});

// Setup Route Bindings
exports = module.exports = function(app) {
	
  app.get('/', function(req, res){
    res.redirect('/keystone');
  });

  app.use('/api/v1', require('./api/index'));
		
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
