var common = require('./common');
var parser = require('sexp-parser.js');

var $i = function(v){
  return ['identifier', v];
};

var should_parse = function(name, input, expected){
  exports[name] = function(test){
    test.deepEqual(parser.parse(input), ['script', expected]);
    test.done();
  };
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

should_parse('if with one branch',
  'if (opposite) { number = -42; }',
  [ 'if',
    $i('opposite'),
    [ 'block',
      [ 'assign', $i('number'), [ 'unary_minus', 42 ]]]]
);

should_parse('if with else',
  'if (opposite) { number = 1; } else { number = 2; }',
  [ 'if',
    $i('opposite'),
    [ 'block',
      [ 'assign', $i('number'), 1 ]],
    [ 'block',
      [ 'assign', $i('number'), 2 ]]]
);

should_parse('if with else if',
  'if (a) { b = 1; } else if (c) { b = 2; } else { b = 3; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), 1]],
    [ 'if',
      $i('c'),
      [ 'block',
        [ 'assign', $i('b'), 2]],
      [ 'block',
        [ 'assign', $i('b'), 3]]]]
);

should_parse('array',
  'list = [1, 2, 3, 4, 5];',
  [ 'assign',
    $i('list'),
    [ 'array_init', 1, 2, 3, 4, 5 ]]
);

should_parse('function',
  'square = function(x) {'+
  '  return x * x;'+
  '};',
  [ 'assign',
    $i('square'),
    [ 'function',
      [ 'return',
        [ 'mul', $i('x'), $i('x') ]]]]
);

should_parse('object',
  'math = {'+
  '  root: Math.sqrt,'+
  '  square: square,'+
  '  cube: function(x) {'+
  '    return x * square(x);'+
  '  }'+
  '};',
  [ 'assign',
    $i('math'),
    [ 'object_init',
      [ 'property_init',
        $i('root'),
        [ 'dot',
          $i('Math'),
          $i('sqrt') ]],
      [ 'property_init',
        $i('square'),
        $i('square') ],
      [ 'property_init',
        $i('cube'),
        [ 'function',
          [ 'return',
            [ 'mul',
              $i('x'),
              [ 'call', $i('square'),
                [ 'list', $i('x') ]]]]]]]]
);
