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
  },
  useImageMagick: true
});

var uploader = framer.handleUpload({});
var server = framer.serveImage({
  cacheMaxAge: 3600
});

app.use(morgan('combined'));
app.use(cors());

app.post('/img', function (req, res) {
  console.log('Uploading image');

  if(req.header('Authorization') !== nconf.get('TOKEN')) {
    console.log('But not allowed to upload!');
    return res.status(401).send('');
  }

  uploader(req, res);
});

app.use(function (req, res) {
  console.log('Serving image');
  server(req, res);
});

module.exports = app;
