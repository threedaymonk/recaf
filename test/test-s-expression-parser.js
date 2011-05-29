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
  [ 'var', [ $i('foo'), 1 ]]
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
  42
);

should_parse('string',
  '"foo";',
  'foo'
);

should_parse('true',
  'true;',
  true
);

should_parse('false',
  'false;',
  false
);

should_parse('assignment',
  'number = 42;',
  [ 'assign', $i('number'), 42 ]
);

should_parse('negation',
  '-42;',
  [ 'unary_minus', 42 ]
);

should_parse('if with one branch',
  'if (a) { b = 1; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), 1 ]]]
);

should_parse('if with else',
  'if (a) { b = 1; } else { b = 2; }',
  [ 'if',
    $i('a'),
    [ 'block',
      [ 'assign', $i('b'), 1 ]],
    [ 'block',
      [ 'assign', $i('b'), 2 ]]]
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
  'list = [1, 2];',
  [ 'assign',
    $i('list'),
    [ 'array_init', 1, 2 ]]
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
        [ 'property_init', $i('b'), 'one' ],
        [ 'property_init', $i('c'), 2 ]]]]
);

should_parse('ternary operator',
  'a ? b : c',
  [ 'hook', $i('a'), $i('b'), $i('c') ]
);

should_parse('array subscript',
  'foo[0];',
  [ 'index', $i('foo'), 0 ]
);

should_parse('function with arguments',
  'var a = function() { return arguments[0]; }',
  [ 'var',
    [ $i('a'),
      [ 'function',
        [],
        [ 'return',
          [ 'index', $i('arguments'), 0 ]]]]]
);

should_parse('typeof and strings',
  'if (typeof elvis !== "undefined" && elvis !== null) {'+
  '  alert("I knew it!");'+
  '}',
  [ 'if',
    [ 'and',
      [ 'strict_ne',
        [ 'typeof', [ 'identifier', 'elvis' ]],
        "undefined" ],
      [ 'strict_ne', [ 'identifier', 'elvis' ], [ 'null' ]]],
    [ 'block',
      [ 'call',
        [ 'identifier', 'alert' ],
        [ 'list', "I knew it!"]]]]
);
