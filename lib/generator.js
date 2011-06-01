var util = require('util');

var generate = function(s){
  switch (s[0]) {
    case 'script':
      return generate(s[1]);
    case 'number':
    case 'string':
      return util.inspect(s[1]);
    default:
      return 'TODO';
  }
};

exports.generate = generate;
