var express = require('express');
var request = require('request');
var bluebird = require('bluebird');
var R = require('ramda');
var teksavvyApi = require('../lib/teksavvy-api')(process.env.TEKSAVVY_KEY);
var logIt = require('../lib/logIt');
var dateFilters = require('../lib/dateFilters');
var teksavvyUsage = require('../lib/teksavvy-usage');

var app = express();


app.get('/', function (req, res) {

  teksavvyUsage
    .getPeakDownloadForMonth(new Date())
    .then(function (result) {
      logIt(result);
      res.status(200).json(result);
    });

});


app.listen(process.env.PORT || 3000);