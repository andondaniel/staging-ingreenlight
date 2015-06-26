'use strict';

var app = require('../app');
var request = require('supertest-as-promised');
var expect = require('chai').expect;

describe('Landing Page', function(){

  it('should redirect to /keystone', function(){
    return request(app)
      .get('/')
      .expect(302)
      .then(function(res){
        expect(res.header.location).to.eql('/keystone');
      });
  });

});