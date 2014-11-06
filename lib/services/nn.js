var nn = require('nearest-neighbor');
var fields = [
  { name: "timezone", measure: nn.comparisonMethods.word },
  { name: "age", measure: nn.comparisonMethods.number, max: 100 },
  { name: "type", measure: nn.comparisonMethods.word }, 
  { name: "games", measure: nn.comparisonMethods.wordArray }
];

module.exports = function(user, users, cb) {
  nn.findMostSimilar(query, items, fields, cb);
};



