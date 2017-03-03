var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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

exports.routes = {
  '/': exports.paths.siteAssets + '/index.html',
  '/www.google.com': exports.paths.archivedSites + '/www.google.com',
  '/loading.html': exports.paths.siteAssets + '/loading.html'
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
    // console.log(exports.paths.archivedSites + '/' + url);
    if (err) {
      //console.log('File does not exist!');
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    // If URL is not archived
    exports.isUrlArchived(url, function(exists) {
      if (!exists) {

        // do get
        // This is all the shit will be right below - Craig
        http.get('http://' + url + '/', function(res) {
          var statusCode = res.statusCode;
          var contentType = res.headers['content-type'];

          var error;
          if (statusCode !== 200) {
            error = new Error(`Request Failed.\n` +
                              `Status Code: ${statusCode}`);
          }

          if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
          }

          res.setEncoding('utf8');
          var rawData = '';
          res.on('data', function (chunk) {
            rawData += chunk;
          });
          res.on('end', function() {
            // Write to file
            // Inside the callback, write it to archives/sites
            fs.writeFile(exports.paths.archivedSites + '/' + url, rawData, function(err) {
              if (err) {
                console.log('File could not be written');
              }
              // Add to route when we make the file!
              exports.routes['/' + url] = exports.paths.archivedSites + '/' + url;
              console.log(exports.routes);
              fs.writeFile(exports.paths.list, '', function(err) {
                if (err) {
                  console.log('Error clearing sites.txt');
                }
              });
            });
            //console.log(rawData);
          });
        }).on('error', (e) => {
          console.log(e);
          console.log(url);
          console.log(`Got error: ${e.message}`);
        });
      } else {
        // error
        console.log('Url exists. Did not try to download it.');
      }
    }); 
  }); 
};



























