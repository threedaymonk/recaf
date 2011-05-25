var Narcissus = require('narcissus/main');

var tokens = [];
Object.keys(Narcissus.definitions.tokenIds).forEach(function(k){
  tokens[Narcissus.definitions.tokenIds[k]] = k.toLowerCase();
});

var decodeType = function(node){
  return tokens[node.type];
};

var appendChildren = function(sexpr, node){
  return node.children.reduce(function(a, e){
    a.push(visitNode(e));
    return a
  }, sexpr);
}

var visitExpression = function(node){
  return appendChildren([decodeType(node)], node);
};

var visitValue = function(node){
  return appendChildren([decodeType(node), node.value], node);
};

var visitNode = function(node){
  var type = tokens[node.type];
  var output = [type];

  switch (type) {
    case 'script':
    case 'var':
    case 'dot':
    case 'assign':
      appendChildren(output, node);
      break;
    case 'semicolon':
      output = visitNode(node.expression);
      break;
    case 'identifier':
      if (node.initializer) {
        output = [[type, node.value], visitNode(node.initializer)];
      } else {
        output = [type, node.value];
      }
      break;
    case 'number':
      output = node.value;
      break;
  }

  return output;
};

var parse = function(source){
  return visitExpression(Narcissus.parser.parse(source));
};

exports.parse = parse;
