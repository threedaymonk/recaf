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
    a.push(walkNode(e));
    return a;
  }, sexpr);
};

var walkExpression = function(node){
  return appendChildren([decodeType(node)], node);
};

var walkValue = function(node){
  return appendChildren([decodeType(node), node.value], node);
};

var walkNode = function(node){
  var type = tokens[node.type];
  var output = [type];

  switch (type) {
    case 'return':
      output.push(walkNode(node.value));
      break;
    case 'function':
      output.push(node.params);
      appendChildren(output, node.body);
      break;
    case 'semicolon':
      output = walkNode(node.expression);
      break;
    case 'identifier':
      if (node.initializer) {
        output = [[type, node.value], walkNode(node.initializer)];
      } else {
        output = [type, node.value];
      }
      break;
    case 'true':
    case 'false':
      break;
    case 'number':
    case 'string':
      output.push(node.value);
      break;
    case 'if':
      output.push(walkNode(node.condition));
      output.push(walkNode(node.thenPart));
      if (node.elsePart) {
        output.push(walkNode(node.elsePart));
      }
      break;
    case 'list':
    case 'property_init':
      output = [];
      appendChildren(output, node);
      break;
    default:
      appendChildren(output, node);
      break;
  }

  return output;
};

var parse = function(source){
  //var util = require('util');
  //console.log(util.inspect(Narcissus.parser.parse(source), false, 20));
  return walkExpression(Narcissus.parser.parse(source));
};

exports.parse = parse;
