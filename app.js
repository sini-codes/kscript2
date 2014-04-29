var path = require('path');


/** EXPORTING GLOBALS **/
global.Logger = require('./lib/services/logger');

Logger.KScript2("Welcome to kscript2!");
Logger.KScript2("Loading core services...");

global.Config = require("./lib/services/config");
global.RCON = require("./lib/services/rcon");
global.GameEvents = require('./lib/services/game_events');
global.Parser = require('./lib/services/parser');
global.Dao = require('./lib/services/dao');


/** LOADING MODS */
Logger.KScript2("Loading mods...")

var modList = Config.mods;

for (var i = 0; i < modList.length; i++) {
  var obj = modList[i];
  try{
    require('./mods/'+obj);
    Logger.KScript2(obj+" mod was succesfully loaded!");
  }  catch (err) {
    Logger.Warning("Sorry, can't load "+obj+" mod: "+err.toString());
  }
}

// BOOTSTRAPING BY LINKING RCON WITH GAME_EVENTS and PARSER
RCON.on("message", function (data) {
  data = data.replace(/\[\d{2}:\d{2}:\d{2}\][\s]*/g,'');//Eliminating timestamps
  var strings = data.toString().split('\n');
  for (var i = 0; i < strings.length; i++) {
    var obj = strings[i].trim();
    if("" === obj) continue; //ignore empty messages
    if(Config.showServerLog)
      Logger.Server(obj);
    Parser.parseData(obj);
  }
});

RCON.on("connect", function () {
  GameEvents.emit("connect");
});

RCON.on("reconnect", function () {
  GameEvents.emit("reconnect");
});

RCON.on("close", function () {
  GameEvents.emit("close");
});

RCON.connect();




