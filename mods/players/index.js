var players = {};
var playerCount = 0;
var teamsInitialized = false;
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

    if(!players[player]){
      players[player] = new PlayerObject(player,id,ip,hwid);
      GameEvents.emit('player_connect',player,players[player]);
    } else {
      players[player].login = player;
      players[player].id= id;
      players[player].ip= ip;
      players[player].hwid= hwid;
    }
    GameEvents.emit('player_update',player, players[player]);

    if(!teamsInitialized){
      setTimeout(function(){
        RCON.send('print("LISTING TEAMS");');

        for(var p in players){
          //Ultra shit.
          RCON.send('print("'+ p +' : "+getPlayerByUsername("'+ p+'").getTeamNum());');
        }
        RCON.send('print("END LISTING TEAMS");');

      },1000);
      teamsInitialized = true;
    }

  }
);

Parser.onComposition({
  start:"^LISTING[\\s]TEAMS",
  content:"(?<player> [\\w-]+) [\\s]+ : [\\s]+(?<team> [\\d]+)",
  end:"^END[\\s]LISTING[\\s]TEAMS"

},function(pairs){
  console.log('got pairs');
  for (var i = 0; i < pairs.length; i++) {
    var obj = pairs[i];
    players[obj.player].team = obj.team
    console.log(players[obj.player].login +" is set to "+obj.team);
  }
})

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

Parser.onRegex(
  "^(?<player> [\\w-]+)" +
    "[\\s]+changed[\\s]+team[\\s]+from[\\s]+" +
    "(?<oldteam> [\\d]+)" +
    "[\\s]+to[\\s]+" +
    "(?<newteam> [\\d]+) .*",
  function (player,oldteam,newteam) {
    players[player].team = newteam;
    GameEvents.emit('player_changed_team',player,oldteam,newteam);
  }
);

var PlayerObject = function PlayerObject(login,id,ip,hwid){
  this.login = login,
  this.id = id,
  this.ip = ip,
  this.hwid = hwid,
  this.team = 255;
  /**
   * Description
   * @method kick
   * @return
   */
  this.kick = function(){
    Commands.kick(this.id);
  },
  /**
   * Description
   * @method ban
   * @param {} time
   * @return
   */
    this.ban = function(time){
    Commands.ban(this.id,time);
  },
  /**
   * Description
   * @method mute
   * @param {} time
   * @return
   */
  this.mute = function(time){
    Commands.mute(this.id);
  },
  /**
   * Description
   * @method freeze
   * @return
   */
  this.freeze = function(){
    Commands.freeze(this.id);
  },
  /**
   * Description
   * @method unfreeze
   * @return
   */
  this.unfreeze = function(){
    Commands.unfreeze(this.id);
  },
  /**
   * Description
   * @method unban
   * @return
   */
  this.unban = function(){
    Commands.unban(this.id);
  },
  /**
   * Description
   * @method unmute
   * @return
   */
  this.unmute = function(){
    Commands.unmute(this.id);
  }
};


global.Players = players;