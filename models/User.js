'use strict';

var keystone = require('keystone');
var uuid = require('node-uuid');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {
  track: true
});

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: true },
  apiToken: { type: Types.Text, required: true, default: uuid.v1, dependsOn: { role: 'Admin' } }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true, default: true },
  role: { type: Types.Select, options: ['Admin', 'Content Manager', 'Viewer'], initial: true, required: true}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
  return this.isAdmin;
});

/**
 * Registration
 */

User.defaultColumns = 'name, email, role';
User.register();
