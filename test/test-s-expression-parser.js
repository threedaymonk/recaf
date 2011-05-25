var common = require('./common');
var parser = require('sexp-parser.js');

var should_parse = function(name, input, expected){
  exports[name] = function(test){
    test.deepEqual(parser.parse(input), expected);
    test.done();
  }
};

should_parse('variable declarations',
  'var cubes, list, math, num, number, opposite, race, square;',
  ['script',
    ['var',
      ['identifier', 'cubes'],
      ['identifier', 'list'],
      ['identifier', 'math'],
      ['identifier', 'num'],
      ['identifier', 'number'],
      ['identifier', 'opposite'],
      ['identifier', 'race'],
      ['identifier', 'square']]]
);

should_parse('dot calls',
  'var __slice = Array.prototype.slice;',
  ['script',
    ['var',
      [ ['identifier', '__slice'],
        ['dot',
          ['dot',
            ['identifier', 'Array'],
            ['identifier', 'prototype']],
          ['identifier', 'slice']]]]]
);

should_parse('assignment',
  'number = 42;',
  ['script',
    ['assign', ['identifier', 'number'], 42]]
);
