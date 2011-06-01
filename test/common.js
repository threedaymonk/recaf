var path = require("path");
require.paths.unshift(path.join(path.dirname(__filename), '../lib'));

exports.identifier = function(v){
  return [ 'identifier', v ];
};

exports.number = function(v){
  return [ 'number', v ];
};

exports.string = function(v){
  return [ 'string', v ];
};
