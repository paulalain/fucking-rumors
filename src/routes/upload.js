process.env.TMPDIR = 'tmp';

var express = require('express');
var commons = require('../commons');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('../flow-node.js')('tmp');
var fs = require('fs');

var routerUpload = express.Router();

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

// Handle uploads through Flow.js
routerUpload.post('/artiste', commons.requireRole('moderateur'), multipartMiddleware, function(req, res) {
  flow.post(req, function(status, filename, original_filename, identifier, currentTestChunk, numberOfChunks) {
    console.log('POST', status, original_filename, identifier);

    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    res.status(status).send();

    if (status === 'done' && currentTestChunk > numberOfChunks) {
      var stream = fs.createWriteStream('./public/img/artists/' + filename);
      flow.write(identifier, stream, { onDone: flow.clean });            
    }         
  });
});


routerUpload.options('/artiste', function(req, res){
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
routerUpload.get('/artiste', function(req, res) {
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'found') {
      status = 200;
    } else {
      status = 404;
    }

    res.status(status).send();
  });
});

routerUpload.get('/download/:identifier', function(req, res) {
  flow.write(req.params.identifier, res);
});

module.exports = routerUpload;