'use strict';

var _ = require('underscore');
var keystone = require('keystone');
var countries  = require('country-data').countries;
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var Project = new keystone.List('Project', {
  defaultSort: 'name',
  dashboardSort: '-createdAt',
  publicConditions: {
    projectType: { $exists: true, $ne: '' },
    productionStatus: { $exists: true, $ne: '' },
    description: { $exists: true, $ne: '' }
  },
  track: true
});

Project.add('Basic Information', {
  name: { type: Types.Text, unique: true },
  images: { type: Types.CloudinaryImages, folder: 'glcms/project-images/' },
  alternativeName: { type: Types.Text },
  productionStatus: { type: Types.Select, options: ['In-Development', 'Released'] },
  projectType: { type: Types.Select, 
    options: ['film', 'game', 'Series', 'Full Game', 'Experience', 'Tech Demo', 'Pre-Release', 'Official Mod'],
    required: true, initial: true },
  subType: { type: Types.TextArray, note: 'For example, "Horror"' },
  description: { type: Types.Textarea },
  about: { type: Types.Textarea },
  // price: { type: Types.Money, currency: 'en-us' },
  organization: { type: Types.Relationship, ref: 'Organization', many: true },
  platforms: { type: Types.Relationship, ref: 'Platform', many: true },
  inputs: { type: Types.Relationship, ref: 'InputDevice', many: true },
  fundingOrganizations: { type: Types.Relationship, ref: 'Organization', many: true }
});

Project.add('Additional Information', {
  countryOfOrigin: { type: Types.Select, options: _.pluck(countries.all, 'name') },
  releaseYear: { type: Types.Text, match: /\d\d\d\d/, note: 'Format: YYYY (e.g. 2012)' },
  releaseDate: { type: Types.Date },
  award: { type: Types.TextArray }
});

Project.add('URLs', {
  url: { type: Types.Url },
  wikipediaUrl: { type: Types.Url },
  facebookUrl: { type: Types.Url },
  twitterUrl: { type: Types.Url },
  oculusShareUrl: { type: Types.Url },
  wearvrUrl: { type: Types.Url },
  googlePlayUrl: { type: Types.Url }
});

Project.add(
  { heading: 'Film Properties', dependsOn: { projectType: 'film' }},
  { film: {
    genre: { type: Types.Relationship, ref: 'FilmGenre', many: true },
    trailer: { type: Types.Url },
    duration: { type: Types.Text, match: /(\d\d:)?\d\d:\d\d/, note: 'Enter as [HH:]MM:SS, e.g. "01:13:33" or "55:01"' }
  }
});

Project.schema.add({
  metadata: {}
});

contentEventHandler.mountMiddleware('Project', Project.schema);

Project.relationship({ path: 'contributions', ref: 'Contribution', refPath: 'project' });
Project.relationship({ path: 'mentions', ref: 'Mention', refPath: 'project' });

Project.defaultColumns = 'name, projectType, productionStatus, description';
Project.register();