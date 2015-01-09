var bluebird = require('bluebird');
var pRequest = bluebird.promisify(require('request'))
var R = require('ramda');

var URL = 'https://api.teksavvy.com/web/Usage/UsageRecords';

var headers = {
  'Teksavvy-APIKey': null
};

function getUsage() {
  return pRequest({
    url: URL,
    json: true,
    method: 'get',
    headers: headers
  });
}


module.exports = exports = function (apiKey) {
  headers['Teksavvy-APIKey'] = apiKey;

  return {
    getUsage: getUsage
  }
}