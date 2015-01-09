var express = require('express');
var request = require('request');
var bluebird = require('bluebird');
var R = require('ramda');

var app = express();

//app.get('/', function (req, res) {

var url = 'https://api.teksavvy.com/web/Usage/UsageRecords';
var headers = {
  'Teksavvy-APIKey': process.env.TEKSAVVY_KEY
};

var pRequest = bluebird.promisify(request)

function doRequest() {
  return pRequest({
    url: url,
    json: true,
    method: 'get',
    headers: headers
  });
}

function logIt(input) {
  console.log(JSON.stringify(input, null, ' '));
  return input;
}


function fixDate(input) {
  var tPos = input.Date.indexOf('T');
  input.Date = input.Date.substring(0, tPos);
  var date = input.Date.split('-');
  input.Date = new Date(date[0], parseInt(date[1], 10) - 1, date[2]);
  return input;

}

function getFirstOfMonth(date) {

  date = new Date(date.getFullYear(), date.getMonth(), 1);
  return date;
}

function getLastOfMonth(date) {

  date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return date;
}

function isAfterDate(date, inputDate) {

  var date = getFirstOfMonth(date);
  return (inputDate.Date >= date);

}

function isBeforeDate(date, inputDate) {

  var endDate = getLastOfMonth(date);
  return (inputDate.Date <= date)

}

var afterMonthStart = R.curry(isAfterDate)(new Date());
var beforeMonthEnd = R.curry(isBeforeDate)(new Date());

var getResult = R.pPipe(doRequest,
  R.pluck('body'),
  R.head,
  R.prop('value'),
  R.map(fixDate),
  R.filter(afterMonthStart),
  R.filter(beforeMonthEnd),
  R.pluck('OnPeakDownload'),
  R.sum
);

var logResult = R.pPipe(getResult, logIt);
app.get('/', function (req, res) {
  getResult().then(function (result) {
    logIt(result);
    res.status(200).json(result);
  });
});

logResult();


app.listen(process.env.PORT || 3000);