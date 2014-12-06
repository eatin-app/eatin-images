'use strict';

var express    = require('express');
var nconf      = require('nconf');
var morgan     = require('morgan');
var cors       = require('cors');
var Framer     = require('framer');

var app        = express();

var framer = new Framer({
  s3: {
    secure: false,
    key: nconf.get('AWS_ACCESS_KEY_ID'),
    secret: nconf.get('AWS_SECRET_ACCESS_KEY'),
    bucket: nconf.get('S3_BUCKET'),
    region: nconf.get('S3_REGION')
  }
});

var uploader = framer.handleUpload({
  //## Check that the request comes from the api
  /*authHandler: function (authValue, callback) {
    console.log(authValue);
    callback(null, '1');
  },*/
});

var server = framer.serveImage({
  cacheMaxAge: 3600
});

app.use(morgan('combined'));
app.use(cors());

app.post('/img', function (req, res) {
  uploader(req, res);
});

app.use(function (req, res) {
  server(req, res);
});

module.exports = app;
