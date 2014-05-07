var db;
var dbName = "ranking";


//When we load the mod, we want it to load our database.
//This is done using async function Dao.getDatastore
Dao.getDatastore(dbName, function (err, datastore) {
  if (err) throw new err;
  //once db is loaded - we assign it global variable
  db = datastore;
});


/* GAME EVENTS HOOKS */
//hook up to "player_killed" event from "stats" mod
GameEvents.on("player_killed", function (victim, killer) {
  //If we have a victim
  if (victim) {
    //Find a player with such a login
    getRankedPlayer(victim, function (err,rankedPlayer) {
      //Increase deaths and update points
      rankedPlayer.deaths++;
      rankedPlayer.points = rankedPlayer.kills / (rankedPlayer.deaths + 1); // points calculation formula
      //Save it
      saveRankedPlayer(rankedPlayer);
    })
  }
  //Same as with victim
  if (killer) {
    getRankedPlayer(killer, function (err,rankedPlayer) {
      rankedPlayer.kills++;
      rankedPlayer.points = rankedPlayer.kills / (rankedPlayer.deaths + 1); // points calculation formula
      saveRankedPlayer(rankedPlayer,function(){
      });
    })
  }
})

//hook up to chat_command from "chat" mod
GameEvents.on("chat_command", function (player, cmd, args, argl) {
  if(cmd != "rank") return;

  //If no argument - display current player
  if(!args[0])
    showPlayerRank(player,player);
  //If argument is "top" then display top
  else if(args[0] == "top") showTop(player);
  //Else display player with name equal to argument
  else showPlayerRank(player,args[0]);

  //Set up timeout to clear the window
  setTimeout(function(){
    RCON.send(compileMessage(player,"")); // Clear the screen with an empty message
  },10000);


});

/* HELPER METHODS */

//Async function to get a player
function getRankedPlayer(login, cb) {
  if (!db) return;
  db.findOne({login: login}, function (err, player) {
    //If no player with this name found, we create one
    if (!player)
      player = new RankedPlayer(login);

    if(cb) cb(err, player);
  });
}

//Async function to save the player. check NeDB documentation for details.
function saveRankedPlayer(player, cb) {
  if(!db) return;
  cb = cb || function(){};
  //upsert:true means:
  //If no player with such login is found,
  //create a new object in the db with those values and give it _id
  db.update({login: player.login}, player, {upsert: true}, cb);
}

//Ranked player scheme
function RankedPlayer(login) {
  this.login = login;
  this.kills = 0;
  this.deaths = 0;
  this.points = 0;
}

//Compile code to sync the message to player
function compileMessage(player, message) {
  return "CRules@ rules = getRules();" +
    'CPlayer@ player = getPlayerByUsername("' + player + '");' +
    'if(player is null) return;' +
    'rules.set_string("rank_message","' + message + '");' +
    'rules.SyncToPlayer("rank_message",player);';
}

function showPlayerRank(requester,targetPlayer){
  getRankedPlayer(targetPlayer,function(err,rankedPlayer){
    if(err) console.log(err.message);
    var message = targetPlayer+" has:\\n" +
      "Kills: "+ rankedPlayer.kills + "\\n" +
      "Deaths: "+ rankedPlayer.deaths + "\\n" +
      "Points: "+rankedPlayer.points;
    RCON.send(compileMessage(requester,message));
  });
}

function showTop(requester){
  db.find().sort({ points: -1 }).limit(10).exec(function (err, topPlayers) {
    var topStr="";
    for (var i = 0; i < topPlayers.length; i++)
      topStr += (i + 1) + ". " + topPlayers[i].login + " with " + topPlayers[i].points + " points\\n";
    RCON.send(compileMessage(requester,topStr));
  });
}