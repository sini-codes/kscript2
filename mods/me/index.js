var moment = require('moment');
var c = Config.me;
var antispamCache = {};

GameEvents.on('chat_command', function (player, command, args, argl) {
 // console.log(command);
  //console.log(argl);
  if(command != "me" )return;
  if(moment().diff(moment(antispamCache[player]),"seconds") < c.cooldown) return;

  antispamCache[player] = moment().format();

  RCON.send('/msg "'+player+" "+argl+'"');


});

GameEvents.on('player_disconnected',function(player){
  delete antispamCache[player];
});

GameEvents.on('player_connect',function(player){
  antispamCache[player] = 0;
});