var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var urlArray;
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('There\'s another error!');
    } else {
      urlArray = data.split('\n');
      callback(urlArray);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  var urlArray;
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('There\'s another error!');
    } else {
      urlArray = data.split('\n');
      callback(urlArray.indexOf(url) > -1);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err) {
    if (err) {
      console.log('Error!');
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile((exports.paths.archivedSites + '/' + url), 'utf8', function(err, data) {
    console.log(exports.paths.archivedSites + '/' + url);
    if (err) {
      console.log('File does not exist!');
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
};
