var path = require('path');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parseUrl = url.parse(req.url);
  console.log('This is our req method', req.method);
  if (req.method === 'GET') {
    fs.readFile((archive.paths.siteAssets + '/index.html'), function(err, data) {
      if (err) {
        console.log('There\'s an error!');
      } else {
        res.end(data);
      }
    });
  } else if (req.method === 'POST') {
    console.log('Post received!');

    var data = '';

    req.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      var dataObj = qs.parse(data);
      fs.appendFile(archive.paths.list, (dataObj.url + '\n'), 'utf8', function(err) {
        if (err) {
          console.log('Error!');
        } else {
          res.writeHead(302);
        }
        res.end('Hello, Craig');
      });
    });
  }

  console.log(parseUrl.path);
};
