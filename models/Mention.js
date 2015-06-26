'use strict';

var Promise = require('bluebird');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var Mention = new keystone.List('Mention', {
  track: true
});

Mention.add({
  
  entityType: { type: Types.Select, 
    options: ['Person', 'Organization', 'Project'],
    required: true, initial: true
  },

  contentType: { type: Types.Select, 
    options: ['Article', 'ContentPiece',],
    required: true, initial: true
  },
  
  person: { type: Types.Relationship, ref: 'Person', initial: true, 
    dependsOn: { entityType: 'Person' } },
  organization: { type: Types.Relationship, ref: 'Organization', initial: true,
    dependsOn: { entityType: 'Organization' } },
  project: { type: Types.Relationship, ref: 'Project', initial: true,
    dependsOn: { entityType: 'Project' } },
  
  article: { type: Types.Relationship, ref: 'Article', initial: true,
    dependsOn: { contentType: 'Article' } },
  contentPiece: { type: Types.Relationship, ref: 'ContentPiece', initial: true,
    dependsOn: { contentType: 'ContentPiece' } },

  context: { type: Types.Text }
});

Mention.schema.add({
  metadata: {}
});

contentEventHandler.mountMiddleware('Mention', Mention.schema);

Mention.defaultColumns = 'article, context';
Mention.register();

Promise.promisifyAll(Mention.model);