module.exports = exports = function logIt(input) {
  console.log(JSON.stringify(input, null, ' '));
  return input;
}