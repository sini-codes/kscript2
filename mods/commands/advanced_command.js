var dot = require('dot');

var ban = dot.template('' +
  'CBitStream@ stream;' +
  '{{ for(var key in it) { }}'+
  'Key: {{=key}} Value = {{=it[key]}}\n'+
  '{{ } }}' +
  'SendCommandOnlyServer(getRules().getCommandID(),)');
