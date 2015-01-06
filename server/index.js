var express = require('express');
var request = require('request');
var bluebird = require('bluebird');
var R = require('ramda');

var app = express();

//app.get('/', function (req, res) {

var url = 'https://api.teksavvy.com/web/Usage/UsageRecords';
var headers = {
  'Teksavvy-APIKey': 'B5F0260CC71F09EF0FB9643A707F0307'
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


function filterIt(input) {
  var curDate, endDate, checkDate;
  curDate = new Date();
  curDate.setDate(1);
  endDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0);
  var checkDate = new Date(input.Date);
  return (checkDate >= curDate && checkDate <= endDate)


}

var getResult = R.pPipe(doRequest,
  R.pluck('body'),
  getValue,
  R.filter(filterIt),
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