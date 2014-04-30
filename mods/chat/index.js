/**
 * This mod provides two events:
 * 'chat' - [username,message]
 * 'chat_command' - [username,commandName,arguments,argumentLine]
 * if player types something like "/do 1 delivery cow" then:
 * - username is going to be player's login
 * - commandName is 'do'
 * - arguments are ['1','delivery','cow'] passed as array
 * - argumentLine is '1 delivery cow'
 */

Parser.onRegex(
    "^\\[" +
    "(?<player> [\\w-]+)" +
    "\\][\\s]+:[\\s]" +
    "(?<message>.+)",
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