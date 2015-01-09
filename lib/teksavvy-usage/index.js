var teksavvyApi = require('../../lib/teksavvy-api')(process.env.TEKSAVVY_KEY);
var dateFilters = require('../../lib/dateFilters');
var R = require('ramda');

function fixDate(input) {
  var tPos = input.Date.indexOf('T');
  input.Date = input.Date.substring(0, tPos);
  var date = input.Date.split('-');
  input.Date = new Date(date[0], parseInt(date[1], 10) - 1, date[2]);
  return input;

}

function getResult(date) {
  return R.pPipe(teksavvyApi.getUsage,
    R.pluck('body'),
    R.head,
    R.prop('value'),
    R.map(fixDate),
    dateFilters.afterMonthStart(date),
    dateFilters.beforeMonthEnd(date),
    R.pluck('OnPeakDownload'),
    R.sum
  );
}

module.exports = exports = {
  getPeakDownloadForMonth: function (date) {
    return getResult(date)();
  }
}