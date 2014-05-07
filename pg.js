var dot = require('dot');

dot.templateSettings = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false
};

var ban = dot.template('' +
  'CBitStream@ = @CBitStream;' +
  '{{ for(var key in it) { }}'+
  'Key: {{=key}} Value = {{=it[key]}}\n'+
  '{{ } }}' +
  'SendCommandOnlyServer(1,)');

console.log(ban({
  str : 3,
  agi : 5,
  lvl : 8
} ));