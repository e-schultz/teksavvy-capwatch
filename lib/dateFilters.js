var R = require('ramda')


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

module.exports = exports = {
  afterMonthStart: function (date) {
    return R.filter(R.curry(isAfterDate)(date))
  },
  beforeMonthEnd: function (date) {
    return R.filter(R.curry(isBeforeDate)(date))
  }
}