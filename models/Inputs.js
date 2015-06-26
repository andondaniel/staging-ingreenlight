'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;

var InputDevice = new keystone.List('InputDevice', {
  defaultSort: 'name',
  track: true
});

InputDevice.add({
  name: { type: Types.Text, required: true, unique: true }
});

InputDevice.defaultColumns = 'name';

InputDevice.relationship({ path: 'projects', ref: 'Project', refPath: 'inputs' });

InputDevice.register();