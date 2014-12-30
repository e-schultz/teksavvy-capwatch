var express = require('express');
var request = require('request');
var bluebird = require('bluebird');
var R = require('ramda');

var app = express();

app.get('/', function (req, res) {

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
    return input[0].value;
  }

  R.pPipe(doRequest,
      R.pluck('body'),
      getValue,
      R.pluck('OnPeakDownload'),
      R.sum)
    ().then(function (
      result) {
      res.status(200).json(result)

    });


});

app.listen(process.env.PORT || 3000);