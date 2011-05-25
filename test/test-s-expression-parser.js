var common = require('./common');
var parser = require('sexp-parser.js');

var $i = function(v){
  return ['identifier', v];
}

var should_parse = function(name, input, expected){
  exports[name] = function(test){
    test.deepEqual(parser.parse(input), ['script', expected]);
    test.done();
  }
};

should_parse('variable declarations',
  'var cubes, list, math, num, number, opposite, race, square;',
  [ 'var',
    $i('cubes'),
    $i('list'),
    $i('math'),
    $i('num'),
    $i('number'),
    $i('opposite'),
    $i('race'),
    $i('square') ]
);

should_parse('dot calls',
  'var __slice = Array.prototype.slice;',
  [ 'var',
    [ $i('__slice'),
      [ 'dot',
        [ 'dot',
          $i('Array'),
          $i('prototype')],
        $i('slice') ]]]
);

should_parse('assignment of number',
  'number = 42;',
  [ 'assign', $i('number'), 42 ]
);

should_parse('assignment of boolean',
  'opposite = true;',
  [ 'assign', $i('opposite'), true ]
);
