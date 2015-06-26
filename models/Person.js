'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var Person = new keystone.List('Person', {
  defaultSort: '-updatedAt',
  publicConditions: {
    'name.first': { $exists: true, $ne: '' },
    'name.last': { $exists: true, $ne: '' },
    jobTitle: { $exists: true, $ne: '' }
  },
  track: true
});

Person.add('Basic Information', {
  name: { type: Types.Name, unique: true },
  middleName: { type: Types.Text },
  alias: { type: Types.Text },
  email: { type: Types.Email },
  phone: { type: Types.Text },
  location: { type: Types.Text },
  jobTitle: { type: Types.Text },
  description: { type: Types.Textarea },
  experience: { type: Types.TextArray },
  education: { type: Types.TextArray },
  skills: { type: Types.TextArray },
});

Person.add({ heading: 'URLs' }, {
  linkedinUrl: { type: Types.Url, label: 'Linkedin' },
  wikipediaUrl: { type: Types.Url, label: 'Wikipedia' },
  twitterUrl: { type: Types.Url, label: 'Twitter' },
  facebookUrl: { type: Types.Url, label: 'Facebook' },
  imdbUrl: { type: Types.Url, label: 'IMDB' },
  personalUrl: { type: Types.Url, label: 'Personal Website' }
});

Person.schema.add({
  metadata: {}
});

Person.defaultColumns = 'name, jobTitle, linkedinUrl';

Person.relationship({ path: 'employeeAt', ref: 'Organization', refPath: 'employees' });
Person.relationship({ path: 'founder', ref: 'Organization', refPath: 'founder' });
Person.relationship({ path: 'contributions', ref: 'Contribution', refPath: 'person' });
Person.relationship({ path: 'mentions', ref: 'Mention', refPath: 'person' });

Person.register();

Promise.promisifyAll(Person.model);

Person.schema.path('_id').validate(function(value, respond){
  if(!this.isNew) return respond(true);
  Person.model.findOneAsync({ 'name.first': this.name.first, 'name.last': this.name.last })
  .then(function(existingUser){
    respond(existingUser === null);
  });
}, 'A Person with the same name already exists.');

contentEventHandler.mountMiddleware('Person', Person.schema);