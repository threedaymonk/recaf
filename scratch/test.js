var Narcissus = require('narcissus/main');
var fs = require('fs');
var util = require('util');

var tokens = [];
Object.keys(Narcissus.definitions.tokenIds).forEach(function(k){
  tokens[Narcissus.definitions.tokenIds[k]] = k;
});

var decodeType = function(node){
  return tokens[node.type];
}

var appendChildren = function(sexpr, node){
  return node.children.reduce(function(a, e){
    a.push(visitNode(e));
    return a
  }, sexpr);
}

var visitExpression = function(node){
  return appendChildren([decodeType(node)], node);
}

var visitValue = function(node){
  return appendChildren([decodeType(node), node.value], node);
}

var visitNode = function(node){
  if (node.expression) {
    return visitExpression(node.expression);
  } else if (node.value) {
    return visitValue(node);
  } else {
    return appendChildren([], node);
  }
};

var UNTIDY = ['source', 'lineno', 'end', 'start', 'unexpectedEOF', 'cursor', 'tokenizer', 'funDecls', 'varDecls', 'impDecls', 'expDecls'];
var tidy = function(node){
  if (node instanceof Array) {
    return node.map(function(e){
      return tidy(e);
    });
  } else if (node instanceof Object) {
    return Object.keys(node).reduce(function(a, k){
      if (node[k] === []) {
        // ignore
      } else if (k === "type") {
        a[k] = tokens[node[k]];
      } else if (UNTIDY.indexOf(k) === -1) {
        //console.log('accept ' + k);
        a[k] = tidy(node[k]);
      } else {
        //console.log('reject ' + k);
      }
      return a;
    }, {});
  } else {
    return node;
  }
};
/*
var pretty = function(node, depth){
  var indent = function(n){
    parts = [];
    for (var i = 0; i < n; i++) {
      parts.push('  ');
    }
    return '\n' + parts.join(i'');
  }

  if (node instanceof Array){
    return indent(depth) + '[' + node.map(function(e){
      return pretty(e, depth + 1);
    }).join('') + ']'
  } else if (node instanceof Hash) {
    return indent(depth) + '{' + node.map(function(e){
    }).join('') + '}'
  } else {
    return indent(depth) + JSON.stringify(node);
  }

};
*/
console.log(
  util.inspect(
    tidy(
      Narcissus.parser.parse(fs.readFileSync(process.argv[2], 'utf-8'))
    ), false, 10
  )
);
