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
      archive.isUrlArchived(dataObj.url, function(exists) {
        if (exists) {
          fs.readFile((archive.paths.archivedSites + '/' + dataObj.url), function(err, data) {
            if (err) {
              console.log('There\'s an error!');
            } else {
              res.writeHead(200);
              res.end(data);
            }
          });
        } else {
          fs.readFile((archive.paths.siteAssets + '/loading.html'), function(err, data) {
            if (err) {
              console.log('There\'s an error!');
            } else {
              res.writeHead(302);
              res.end(data);
            }
          });
        }
      });
    });
  }

  console.log(parseUrl.path);
};
