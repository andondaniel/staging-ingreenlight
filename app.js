'use strict';

var keystone = require('./keystone');
var app = keystone.get('app');
var log = require('blikk-logjs')('app');
var models = require('greenlight-models');

if(process.env.KAFKA_REST_ENDPOINT && 
  process.env.STREAM_OUTPUT_TOPIC && 
  process.env.STREAM_OUTPUT_SCHEMA_ID){
  
  models.contentEventHandler.init({
    kafkaRestEndpoint: process.env.KAFKA_REST_ENDPOINT,
    streamOutputTopic: process.env.STREAM_OUTPUT_TOPIC,
    streamOutputSchemaId: process.env.STREAM_OUTPUT_SCHEMA_ID
  });
  
  log.info({options: models.contentEventHandler.options}, 'initialized ContentEventHandler');
} else {
  log.info('Not publishing changes, environment variables not set.');
}

module.exports = function(){
  keystone.start();
  return app;
}();