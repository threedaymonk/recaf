var util = require('util');

var Line = function(level){
  this._level = level;
  this._parts = [];
};

Line.prototype.push = function(v){
  this._parts.push(v);
};

Line.prototype.render = function(){
  var i;
  if (this._parts.length === 0) {
    return '';
  }
  indent = [];
  for (i = 0; i < this._level; i++) {
    indent.push('  ');
  }
  return indent.join('') + this._parts.join(' ');
};

var Renderer = function(){
  this._level = 0;
  this._lines = [];
  this.cr();
};

Renderer.prototype.indent = function(){
  this._level += 1;
  this.cr();
};

Renderer.prototype.outdent = function(){
  this.level -= 1;
  this.cr();
};

Renderer.prototype.write = function(input){
  this._line.push(input);
};

Renderer.prototype.cr = function(){
  this._line = new Line(this._level);
  this._lines.push(this._line);
};

Renderer.prototype.render = function(){
  return this._lines.map(function(line){
    return line.render();
  }).filter(function(s){
    return s !== '';
  }).join('\n');
};

Renderer.prototype.generate = function(sexp){
  var i, ii;
  var r = this;

  switch (sexp[0]) {
    case 'script':
      r.generate(sexp[1]);
      break;
    case 'number':
    case 'string':
      r.write(util.inspect(sexp[1]));
      break;
    case 'identifier':
      r.write(sexp[1]);
      break;
    case 'var':
      for (i = 1, ii = sexp.length; i < ii; i++) {
        var s = sexp[i];
        if (s[0] === 'identifier') {
          r.generate(s);
          r.write('= null');
          r.cr();
        } else {
          r.generate(s[0]);
          r.write('=');
          r.generate(s[1]);
          r.cr();
        }
      }
      break;
    case 'object_init':
      r.indent();
      for (i = 1, ii = sexp.length; i < ii; i++) {
        r.generate(sexp[i][0]);
        r.write(':');
        r.generate(sexp[i][1]);
        r.cr();
      }
      r.outdent();
      break;
    default:
      r.write('TODO (' + sexp[0] + ')');
  }
};

exports.generate = function(sexp){
  var renderer = new Renderer();
  renderer.generate(sexp);
  return renderer.render();
};
