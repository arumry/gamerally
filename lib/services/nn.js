var nn = require('nearest-neighbor');
var fields = [
  { name: "timezone", measure: nn.comparisonMethods.word },
  { name: "age", measure: nn.comparisonMethods.number, max: 100 },
  { name: "type", measure: nn.comparisonMethods.word }, 
  { name: "games", measure: nn.comparisonMethods.ip }
];

module.exports = function(user, users, cb)
var users = [
  { name: "Bill", age: 10, pc: "Mac", ip: "68.23.13.8" },
  { name: "Alice", age: 22, pc: "Windows", ip: "193.186.11.3" },
  { name: "Bob", age: 12, pc: "Windows", ip: "56.89.22.1" }
];

var query = { name: "Bob", age: 12, pc: "Windows", ip: "68.23.13.10" };



nn.findMostSimilar(query, items, fields, function(nearestNeighbor, probability) {
  console.log(query);
  console.log(nearestNeighbor);
  console.log(probability);
});