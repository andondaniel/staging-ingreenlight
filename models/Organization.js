'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;
var contentEventHandler = require('greenlight-models').contentEventHandler;

var Organization = new keystone.List('Organization', {
  defaultSort: '-createdAt',
  track: true,
  publicConditions: {
    name: { $exists: true, $ne: '' },
    description: { $exists: true, $ne: '' }
  },
  label: 'Company',
  singular: 'Company',
  plural: 'Companies'
});

Organization.add('Basic Info', {
  name: { type: Types.Text, required: true, unique: true },
  logo: { type: Types.CloudinaryImage, folder: 'glcms/organization-logos/' },
  description: { type: Types.Textarea },
  tradingStatus: { type: Types.Select, options: ['Public', 'Private'] },
  size: { type: Types.Select, options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '5001-10,000', '10,000+'] }
});

Organization.add('URLs', {
  companyUrl: { type: Types.Url },
  wikipediaUrl: { type: Types.Url },
  linkedinUrl: { type: Types.Url },
  twitterUrl: { type: Types.Url },
  facebookUrl: { type: Types.Url }
});

Organization.add('Contact Information', {
  email: { type: Types.Email },
  phone: { type: Types.Text },
  address: { type: Types.Location }
});

Organization.add('People', {
  founder: { type: Types.Relationship, ref: 'Person', many: true },
  employees: { type: Types.Relationship, ref: 'Person', many: true }
});


Organization.add('Sub-Organizations', {
  subOrganizations: { type: Types.Relationship, ref: 'Organization', many: true },
});

Organization.add('Additional Information', {
  foundingYear: { type: Types.Text, match: /\d\d\d\d/, note: 'Format: YYYY (e.g. 2012)' },
  foundingLocation: { type: Types.Text },
  legalName: { type: Types.Text },
});

Organization.schema.add({
  metadata: {}
});

Organization.defaultColumns = 'name, companyUrl, description';

Organization.relationship({ path: 'projects', ref: 'Project', refPath: 'organization' });
Organization.relationship({ path: 'fundedProjects', ref: 'Project', refPath: 'fundingOrganization' });
Organization.relationship({ path: 'subOrganization', ref: 'Organization', refPath: 'subOrganizations' });
Organization.relationship({ path: 'contributions', ref: 'Contribution', refPath: 'organization' });
Organization.relationship({ path: 'mentions', ref: 'Mention', refPath: 'organization' });

contentEventHandler.mountMiddleware('Organization', Organization.schema);

Organization.register();