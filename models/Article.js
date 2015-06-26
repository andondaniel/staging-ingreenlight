'use strict';

var keystone = require('keystone');
var natural = require('natural');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var Article = new keystone.List('Article', {
  map: { name: 'title' },
  defaultSort: '-date',
  track: true,
  publicConditions: {
    url: { $exists: true, $ne: '' },
    title: { $exists: true, $ne: '' },
    date: { $exists: true, $ne: null },
    description: { $exists: true, $ne: '' }
  },
  dashboardSort: '-date'
});

Article.add({
  url: { type: Types.Url, required: true, initial: true },
  title: { type: Types.Text, initial: true },
  date: { type: Types.Date },
  site: { type: Types.Text },
  description: { type: Types.Textarea, cropAfter: 250},
  keywords: { type: Types.Text },
  content: { type: Types.Textarea },
  author: { type: Types.Text },
  wordCount: { type: Types.Number, noedit: true },
  // URL of the image
  image: { type: Types.Text, hidden: true }
});

Article.schema.pre('save', function(next){
  // Calculate the word count
  var tokenizer = new natural.WordTokenizer();
  this.wordcount = tokenizer.tokenize(this.content || '').length;
  next();
});

contentEventHandler.mountMiddleware('Article', Article.schema);

Article.schema.add({
  metadata: {}
});

Article.relationship({ path: 'mentions', ref: 'Mention', refPath: 'article' });

// Validations
// ==================================================

Article.schema.path('_id').validate(function(value, respond){
  if(!this.isNew) return respond(true);
  Article.model.findOneAsync({ url: this.url })
  .then(function(existingRecord){
    respond(existingRecord === null);
  });
}, 'An article with the same URL already exists.');


Article.defaultColumns = 'title, url, date, description';
Article.register();

module.exports = Article;