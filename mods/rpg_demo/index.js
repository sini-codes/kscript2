var LEVEL_EXP = {
  1: 10,
  2: 15,
  3: 30,
  4: 60,
  5: 100,
  6: 150,
  7: 200,
  8: 300,
  9: 400,
  10: 600
  };
var EXP_ACTION = {
  KILL: 3
};
var SKILLPOINTS_PER_LEVEL = 3;

var MAX_LEVEL = 10;
var db;
Dao.getDatastore("rpg_demo",function(err,datastore){
  db = datastore;
});


/**
 * Description
 * @method RpgPlayer
 * @param {} login
 * @return 
 */
function RpgPlayer(login) {
  this.login = login;
  this.level = 1;
  this.curexp = 0;
  this.maxexp = LEVEL_EXP[this.level];
  this.skillpoints = 3;
  this.agility = 2;
  this.strength = 2;
}

// server_SendCommandToPlayer(uint8, CBitStream&in, CPlayer@)
/**
 * Description
 * @method compileUpdateCommand
 * @param {} rpgPlayer
 * @return BinaryExpression
 */
function compileUpdateCommand(rpgPlayer) {
  return 'CPlayer@ player = getPlayerByUsername("'+rpgPlayer.login+'");' +
    'if(player is null) return;' +
    'CBlob@ blob = player.getBlob();' +
    'if(blob is null) return;'+
    "CBitStream stream();" +
    "stream.write_string(\"" + rpgPlayer.login + "\");" +
    "stream.write_u8(" + rpgPlayer.level + ");" +
    "stream.write_u16(" + rpgPlayer.curexp + ");" +
    "stream.write_u16(" + rpgPlayer.maxexp + ");" +
    "stream.write_u8(" + rpgPlayer.skillpoints + ");" +
    "stream.write_u16(" + rpgPlayer.strength + ");" +
    "stream.write_u16(" + rpgPlayer.agility + ");" +
    "blob.SendCommandOnlyServer(blob.getCommandID(\"character_info\"), stream);" +
    "print('done');";
}

Parser.onRegex('^(?<playerName>  [\\S-]+)[\\s]requests[\\s]character[\\s]info',
  function (playerName) {
    getPlayerByLogin(playerName,function(err,player){
      RCON.send(compileUpdateCommand(player));
    })
  });

Parser.onRegex('^(?<playerName>  [\\S-]+)[\\s]spends[\\s]skillpoint[\\s]for[\\s](?<stat>  [\\S-]+)',
  function (playerName,stat) {
    getPlayerByLogin(playerName,function(err,player){
      if(player.skillpoints>0){
        player.skillpoints--;
        player[stat]+=1;
      }
      savePlayer(player,function(){
        RCON.send(compileUpdateCommand(player));
      });
    });
});

GameEvents.on('player_killed',function(victim,killer){
  if(!killer) return;

  getPlayerByLogin(killer,function(err, player){

    console.log(player.curexp);

    if(player.level == MAX_LEVEL) return;
    player.curexp+=EXP_ACTION.KILL;
    console.log(player.curexp);

    if(player.curexp >= player.maxexp){
      var diff = player.curexp - player.maxexp;
      player.level+=1;
      player.maxexp = LEVEL_EXP[player.level];
      player.curexp = diff;
      player.skillpoints+=SKILLPOINTS_PER_LEVEL;
    }

    savePlayer(player,function(){
      RCON.send(compileUpdateCommand(player));
    });
  });
});

/**
 * Description
 * @method getPlayerByLogin
 * @param {} login
 * @param {} cb
 * @return 
 */
function getPlayerByLogin(login,cb){
  db.findOne({login : login},function(err, player){
    if(!player)
       player = new RpgPlayer(login);

    cb(err,player);
  });
}
/**
 * Description
 * @method savePlayer
 * @param {} player
 * @param {} cb
 * @return 
 */
function savePlayer(player,cb){
  db.update({login:player.login},player,{upsert : true},cb);
}

