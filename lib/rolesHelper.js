'use strict';

var RolesHelper = function(){};

RolesHelper.prototype.readOnlyLists = {
  'Admin': [],
  'Content Manager': [],
  'Viewer': ['Article', 'Contribution', 'FilmGenre', 'Organization', 'Person', 'Project', 'User', 'Mention']
};

RolesHelper.prototype.hiddenLists = {
  'Admin': [],
  'Content Manager': ['User'],
  'Viewer': ['Contribution', 'FilmGenre', 'User', 'Mention']
};

RolesHelper.prototype.hiddenNavSections = {
  'Admin': [],
  'Content Manager': ['users'],  
  'Viewer': ['contributions', 'filmGenres', 'users', 'mentions']
};

module.exports = new RolesHelper();