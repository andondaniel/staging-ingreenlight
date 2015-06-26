'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var ContentPiece = new keystone.List('ContentPiece', {
  map: { name: 'title' },
  defaultSort: '-createdAt',
  track: true
});

ContentPiece.add({
  url: { type: Types.Url, required: true, initial: true },
  title: { type: Types.Text, initial: true, required: true },
  description: { type: Types.Text },
  image: { type: Types.Text },
  contentType: { type: Types.Text },
  author: { type: Types.Text },
  site: { type: Types.Text },
  date: { type: Types.Date },
});

ContentPiece.schema.add({
  metatags: {},
  metadata: {}
});

ContentPiece.relationship({ path: 'mentions', ref: 'Mention', refPath: 'contentPiece' });

ContentPiece.schema.path('_id').validate(function(value, respond){
  if(!this.isNew) return respond(true);
  ContentPiece.model.findOneAsync({ url: this.url })
  .then(function(existingRecord){
    respond(existingRecord === null);
  });
}, 'A Content piece with the same URL already exists.');

contentEventHandler.mountMiddleware('ContentPiece', ContentPiece.schema);

ContentPiece.defaultColumns = 'title, url, date, description';
ContentPiece.register();

module.exports = ContentPiece;