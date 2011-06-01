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
  $n(42),
  '42'
);

should_generate('string',
  $s("'Hello!' said Bob."),
  "'\\\'Hello!\\\' said Bob.'"
);

should_generate('single variable declaration',
  [ 'var', $i('foo') ],
  'foo = null'
);

should_generate('multiple variable declaration',
  [ 'var', $i('foo'), $i('bar') ],
  'foo = null\nbar = null'
);

should_generate('variable initialization',
  [ 'var', [ $i('foo'), $n(1) ]],
  'foo = 1'
);

should_generate('object',
  [ 'var',
    [ $i('a'),
      [ 'object_init',
        [ $i('b'), $s('one') ],
        [ $i('c'), $n(2) ]]]],
  'a =\n'+
  '  b : \'one\'\n'+
  '  c : 2'
);
