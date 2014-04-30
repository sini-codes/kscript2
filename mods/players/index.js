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

      /**
       * Description
       * @method kick
       * @return 
       */
      kick : function(){
        Commands.kick(this.id);
      },
      /**
       * Description
       * @method ban
       * @param {} time
       * @return 
       */
      ban : function(time){
        Commands.ban(this.id,time);
      },
      /**
       * Description
       * @method mute
       * @param {} time
       * @return 
       */
      mute : function(time){
        Commands.mute(this.id);
      },
      /**
       * Description
       * @method freeze
       * @return 
       */
      freeze : function(){
        Commands.freeze(this.id);
      },
      /**
       * Description
       * @method unfreeze
       * @return 
       */
      unfreeze : function(){
        Commands.unfreeze(this.id);
      },
      /**
       * Description
       * @method unban
       * @return 
       */
      unban : function(){
        Commands.unban(this.id);
      },
      /**
       * Description
       * @method unmute
       * @return 
       */
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