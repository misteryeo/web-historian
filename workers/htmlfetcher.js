// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var CronJob = require('cron').CronJob;
var archive = require('../helpers/archive-helpers');
var job = new CronJob({
  cronTime: '*/60 * * * * *',
  onTick: function() {
    /*
     * Runs every day on every minute
     */

    console.log('CRONJOB');
    archive.readListOfUrls(function (urls) {
      archive.downloadUrls(urls);
    });

  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();