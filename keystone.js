// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Greenlight VR',
	'brand': 'Greenlight VR',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'o!(RCXTIz?J!9R9RPMinS5}l0SN3tO&uxbVpNd;!T"HZI.=^6v))[[LO1xwo4bpn'
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// No logging. We have custom logging.
// keystone.set('logger', true);

// Segment.io
keystone.set('segment.io key', process.env.SEGMENT_ANALYTICS_WRITE_KEY);

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'users': 'users',
	'articles': 'articles',
	'projects': 'projects',
	'companies': 'organizations'
});

keystone.set('homeLists', ['Article', 'Project', 'Organization']);

if(process.env.MONGOOSE_DEBUG === 'true'){
	var mongoose = keystone.get('mongoose');
	mongoose.set('debug', true);
}

module.exports = keystone;
