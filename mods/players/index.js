var players = {};
var playerCount = 0;

GameEvents.on("connect",function(){
  RCON.send("/players");
})

Parser.onRegex(
  "^\\[" +
    "(?<player> [\\w-]+)" +
    "\\][\\s]+"+
    "\\(id\\s(?<id> [\\d]+)" +
    "\\)[\\s]+" +
    "\\(ip\\s(?<ip> \\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b)\\) " +
    "[\\s]+" +
    "\\(hwid\\s(?<hwid> [\\d]+)",
  function (player,id,ip,hwid) {
    //If player is here, wr should update instead of creating a new object
    var playerObject = {
      login: player,
      id: id,
      ip: ip,
      hwid: hwid,

      kick : function(){
        if(!Commands) return;
        Commands.kick(this.id);
      },
      ban : function(time){
        if(!Commands) return;
        Commands.ban(this.id,time);
      },
      mute : function(time){
        if(!Commands) return;
        Commands.mute(this.id);
      },
      freeze : function(){
        if(!Commands) return;
        Commands.freeze(this.id);
      },
      unfreeze : function(){
        if(!Commands) return;
        Commands.unfreeze(this.id);
      },
      unban : function(){
        if(!Commands) return;
        Commands.unban(this.id);
      },
      unmute : function(){
        Commands.unmute(this.id);
      }
    };

    if(!players[player]){
      players[player] = playerObject;
      GameEvents.emit('player_connect',player,playerObject);
    }
    players[player] = playerObject;
    GameEvents.emit('player_update',player, playerObject);
  }
);

Parser.onRegex(
  "^(?:\\*\\s)?" +
    "(?<player> [\\w-]+)" +
    "[\\s]+ connected",
  function (time, player) {
    GameEvents.emit('player_connecting',player);
    RCON.send("/players");
  }
);

Parser.onRegex(
  "^Player\\s" +
    "(?<player> [\\w-]+)" +
    "[\\s]+ left\\sthe\\sgame",
  function (player) {
    var cache = players[player];
    delete players[player];
    GameEvents.emit('player_disconnect',player,cache)
  }
);

global.Players = players;