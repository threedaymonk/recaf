var common = require('./common');
var parser = require('sexp-parser.js');

var $i = function(v){
  return [ 'identifier', v ];
};

var $n = function(v){
  return [ 'number', v ];
};

var $s = function(v){
  return [ 'string', v ];
};

var should_parse = function(name, input, expected){
  exports[name] = function(test){
    test.deepEqual(parser.parse(input), ['script', expected]);
    test.done();
  };
};

should_parse('single variable declaration',
  'var foo;',
  [ 'var', $i('foo') ]
);

should_parse('multiple variable declaration',
  'var foo, bar;',
  [ 'var', $i('foo'), $i('bar') ]
);

should_parse('variable initialization',
  'var foo = 1;',
  [ 'var', [ $i('foo'), $n(1) ]]
);

should_parse('dot calls',
  'Array.prototype.slice;',
  [ 'dot',
    [ 'dot',
      $i('Array'),
      $i('prototype')],
    $i('slice') ]
);

should_parse('number',
  '42;',
  $n(42)
);

should_parse('string',
  '"foo";',
  $s('foo')
);

should_parse('true',
  'true;',
  [ 'true' ]
);

should_parse('false',
  'false;',
  [ 'false' ]
);

should_parse('assignment',
  'number = 42;',
  [ 'assign', $i('number'), $n(42) ]
);

should_parse('negation',
  '-42;',
  [ 'unary_minus', $n(42) ]
);

should_parse('if with one branch',
  'if (a) { b = 1; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), $n(1) ]]]
);

should_parse('if with else',
  'if (a) { b = 1; } else { b = 2; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), $n(1) ]],
    [ 'block',
      [ 'assign', $i('b'), $n(2) ]]]
);

should_parse('if with else if',
  'if (a) { b = 1; } else if (c) { b = 2; } else { b = 3; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), $n(1) ]],
    [ 'if',
      $i('c'),
      [ 'block',
        [ 'assign', $i('b'), $n(2) ]],
      [ 'block',
        [ 'assign', $i('b'), $n(3) ]]]]
);

should_parse('array',
  'list = [1, 2];',
  [ 'assign',
    $i('list'),
    [ 'array_init', $n(1), $n(2) ]]
);

should_parse('multiplication',
  'x * x;',
  [ 'mul', $i('x'), $i('x') ]
);

should_parse('function',
  'var square = function(x) {'+
  '  return x;'+
  '};',
  [ 'var',
    [ $i('square'),
      [ 'function',
        [ 'x' ],
        [ 'return', $i('x') ]]]]
);

should_parse('object',
  'var a = { b: "one", c: 2 };',
  [ 'var',
    [ $i('a'),
      [ 'object_init',
        [ $i('b'), $s('one') ],
        [ $i('c'), $n(2) ]]]]
);

should_parse('ternary operator',
  'a ? b : c',
  [ 'hook', $i('a'), $i('b'), $i('c') ]
);

should_parse('array subscript',
  'foo[0];',
  [ 'index', $i('foo'), $n(0) ]
);

should_parse('arguments object',
  'var a = function() { return arguments[0]; }',
  [ 'var',
    [ $i('a'),
      [ 'function',
        [],
        [ 'return',
          [ 'index', $i('arguments'), $n(0) ]]]]]
);


should_parse('typeof',
  'typeof foo;',
  [ 'typeof', $i('foo') ]
);

should_parse('strict equality',
  'a === b',
  [ 'strict_eq', $i('a'), $i('b') ]
);

should_parse('strict inequality',
  'a !== b',
  [ 'strict_ne', $i('a'), $i('b') ]
);

should_parse('function call',
  'foo(1, 2);',
  [ 'call', $i('foo'), [ $n(1), $n(2) ] ]
);

should_parse('and',
  'a && b;',
  [ 'and', $i('a'), $i('b') ]
);
