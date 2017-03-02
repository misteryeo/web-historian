var path = require('path');
var url = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parseUrl = url.parse(req.url);
  console.log(archive.paths.siteAssets + '/index.html');
  fs.readFile((archive.paths.siteAssets + '/index.html'), function(err, data) {
    if (err) {
      console.log('There\'s an error!');
    } else {
      res.end(data);
    }
  });
  console.log(parseUrl.path);
};
