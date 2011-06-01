var common = require('./common');
var generator = require('generator.js');

var $i = common.identifier;
var $n = common.number;
var $s = common.string;

var should_generate = function(name, input, expected){
  exports[name] = function(test){
    test.expect(1)
    test.deepEqual(generator.generate([ 'script', input ]), expected);
    test.done();
  };
};

should_generate('number',
  [ 'number', 42 ],
  '42'
);

should_generate('string',
  [ 'string', "'Hello!' said Bob." ],
  "'\\\'Hello!\\\' said Bob.'"
);
