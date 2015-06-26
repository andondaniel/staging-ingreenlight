'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Platform = new keystone.List('Platform', {
  defaultSort: 'name',
  track: true
});

Platform.add({
  name: { type: Types.Text, required: true, unique: true },
  url: { type: Types.Url, initial: true }
});

Platform.defaultColumns = 'name, url';

Platform.relationship({ path: 'projects', ref: 'Project', refPath: 'platforms' });

Platform.register();