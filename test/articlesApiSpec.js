'use strict';


var app = require('../app');
var uuid = require('node-uuid');
var keystone = require('keystone');
var request = require('supertest-as-promised');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

var ArticleList = keystone.list('Article');
var Article = ArticleList.model;
var User = keystone.list('User').model;

describe('Article API', function(){

  var apiToken = uuid.v1();

  beforeEach(function(){
    return Promise.all([
      Article.remove({}).exec(),
      User.create({name: 'user', email: 'user@ingreenlight.com', password: 'password', role: 'Admin', apiToken: apiToken})
    ]);
  });


  describe('Authentication', function(){

    it('should work', function(){
      return request(app)
        .get('/api/v1/articles/1')
        .expect(401);
    });

  });
  describe('POST /', function(){

    var sampleArticle = {
      url:  'http://www.google.com'
    };

    it('should work', function(){
      var alternativeArticle = {
        url:  'http://www.google.com',
        site: 'Google',
        title: 'I am the title',
        date: new Date(2012,1,1)
      };

      return request(app)
        .post('/api/v1/articles/')
        .auth(apiToken,'')
        .send(alternativeArticle)
        .expect(200).then(function(res){
          var article = res.body;
          expect(article.title).to.eql('I am the title');
          expect(article.site).to.eql('Google');
          expect(new Date(article.date)).to.eql(new Date(2012,1,1));
        });
    });

    it('should return a 400 for an invalid article', function(){
      return request(app)
        .post('/api/v1/articles/')
        .auth(apiToken,'')
        .send({})
        .expect(400);
    });    

  });  

  describe('GET /:id', function(){

    var sampleArticle = {
      _id: mongoose.Types.ObjectId(),
      url:  'http://www.google.com'
    };

    beforeEach(function(){
      return Article.create(sampleArticle);
    });

    it('should work', function(){
      return request(app)
        .get('/api/v1/articles/' + sampleArticle._id)
        .auth(apiToken,'')
        .expect(200)
        .then(function(res){
          var article = res.body;
          expect(article.url).to.eql('http://www.google.com');
        });
    });

  });

  describe('DELETE /:id', function(){

    var sampleArticle = {
      _id: mongoose.Types.ObjectId(),
      url:  'http://www.google.com'
    };

    beforeEach(function(){
      return Article.create(sampleArticle);
    });

    it('should work', function(){
      return request(app)
        .delete('/api/v1/articles/' + sampleArticle._id)
        .auth(apiToken,'')
        .expect(200)
        .then(function(res){
          var article = res.body;
          expect(article.url).to.eql('http://www.google.com');
        });
    });

  });  

  describe('PUT /:id', function(){

    var sampleArticle = {
      _id: mongoose.Types.ObjectId(),
      url:  'http://www.google.com'
    };

    beforeEach(function(){
      return Article.create(sampleArticle);
    });

    it('should work', function(){
      return request(app)
        .put('/api/v1/articles/' + sampleArticle._id)
        .auth(apiToken,'')
        .send({ title: 'I am the new article title' })
        .expect(200)
        .then(function(res){
          var article = res.body;
          expect(article.title).to.eql('I am the new article title');
        });
    });

  });  

});