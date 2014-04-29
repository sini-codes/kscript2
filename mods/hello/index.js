
GameEvents.on('player_connect',function(player,playerObject){
  console.log(player)
  RCON.send('/msg "Hello, '+player.toString()+'"');
})

GameEvents.on('player_disconnect',function(player,playerObject){
  RCON.send('/msg "Bye, '+player+'"');
})