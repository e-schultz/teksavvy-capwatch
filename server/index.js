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

function getValue(input) {
  return input[0].value
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

function filterIt(input) {
  var curDate, endDate;
  curDate = new Date();
  curDate.setDate(1);
  endDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0);
  curDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);


  var result = (input.Date >= curDate && input.Date <= endDate);

  return result;


}

var getResult = R.pPipe(doRequest,
  R.pluck('body'),
  getValue,
  R.map(fixDate),
  R.filter(filterIt),
  logIt,
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
//});

app.listen(process.env.PORT || 3000);