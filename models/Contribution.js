'use strict';

var Promise = require('bluebird');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var Contribution = new keystone.List('Contribution', {
  track: true
});

Contribution.add({
  type: { type: Types.Select, options: ['Person', 'Organization'], required: true, initial: true, default: 'Person' },
  person: { type: Types.Relationship, ref: 'Person',
    initial: true, dependsOn: { type: 'Person' } },
  organization: { type: Types.Relationship, ref: 'Organization',
    initial: true, dependsOn: { type: 'Organization' } },
  project: { type: Types.Relationship, ref: 'Project', many: false,
    required: true, initial: true },
  description: { type: Types.Text, required: true, initial: true }
});

Contribution.schema.add({
  metadata: {}
});

Contribution.defaultColumns = 'person, organization, project, description';
Contribution.register();

Promise.promisifyAll(Contribution.model);

Contribution.schema.path('_id').validate(function(value, respond){
  if(!this.isNew) return respond(true);
  Contribution.model.findOneAsync({
    person: this.person,
    organization: this.organization,
    project: this.project,
    description: this.description }
  ).then(function(existingRecord){
    respond(existingRecord === null);
  });
}, 'This contribution already exists.');

contentEventHandler.mountMiddleware('Contribution', Contribution.schema);