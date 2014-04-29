
var moment = require('moment');
var c = Config.info;

setInterval(function(){
  var strings = c.infoMessage.split('\n');
  for (var i = 0; i < strings.length; i++) {
    var msg = strings[i];
    RCON.send("/msg \""+msg+"\"");
  }
},c.infoInterval * 1000);