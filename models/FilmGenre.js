'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;

var FilmGenre = new keystone.List('FilmGenre', {
  defaultSort: 'name',
  track: true
});

FilmGenre.add({
  name: { type: Types.Text, required: true, unique: true },
  description: { type: Types.Textarea, initial: true }
});

FilmGenre.defaultColumns = 'name, description';

FilmGenre.relationship({ path: 'projects', ref: 'Project', refPath: 'film.genre' });

FilmGenre.register();