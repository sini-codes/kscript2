Parser.onRegex(
    "^\\[" +
    "(?<player> [\\w-]+)" +
    "\\][\\s]+:[\\s]" +
    "(?<command>.+)",
  function (player,message) {
    GameEvents.emit('chat',player,message);
  }
);

Parser.onRegex(
    "^\\[" +
    "(?<player> [\\w-]+)" +
    "\\][\\s]+:[\\s]/" +
    "(?<command>.+)",
  function (player,command) {
    var args = command.split(' ');
    var commandName = args.splice(0,1);
    GameEvents.emit('chat_command',player,commandName,args,command.replace(commandName+" ",""));
  }
);