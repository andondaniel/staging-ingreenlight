'use strict';

var _ = require('lodash');
require('dotenv').load();
var flatten = require('flat');
var Promise = require('bluebird');
var keystone = require('../keystone');
var Person = keystone.list('Person');
var Organization = keystone.list('Organization');
var Project = keystone.list('Project');
var Contribution = keystone.list('Contribution');
var Article = keystone.list('Article');

Promise.promisifyAll(Person.model);
Promise.promisifyAll(Organization.model);
Promise.promisifyAll(Project.model);
Promise.promisifyAll(Contribution.model);
Promise.promisifyAll(Article.model);

var mongoose = keystone.get('mongoose');
mongoose.connect(process.env.MONGO_URI);

var countModelDataPointsAsync = function(model){
  return model.findAsync({}).then(function(records){
    return _(records).map(function(record){
      return _(flatten(record.toObject())).mapValues(function(v){
        return (_.isArray(v)) ? v.length : 1;
      }).sum();
    }).sum();
  });
};

Promise.all([
  countModelDataPointsAsync(Article.model),
  countModelDataPointsAsync(Person.model),
  countModelDataPointsAsync(Organization.model),
  countModelDataPointsAsync(Project.model),
  countModelDataPointsAsync(Contribution.model),
]).spread(function(articleFields, personFields, organizationFields, projectFields, contributionFields){
  console.log('Found %d data points for Article', articleFields);
  console.log('Found %d data points for People', personFields);
  console.log('Found %d data points for Organizations', organizationFields);
  console.log('Found %d data points for Projects', projectFields);
  console.log('Found %d data points for Contributions', contributionFields);
  var totalDataPoints = articleFields + personFields + organizationFields + projectFields + contributionFields;
  console.log('Found %d total data points', totalDataPoints);
}).catch(function(err){
  console.log(err);
}).then(function(){
  process.exit(0);
});