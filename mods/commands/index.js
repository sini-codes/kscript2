var Q = require('q');
var defaultBantime = 60;

var service = {
  ban: function ban(nameOrId, minutes) {
    minutes = minutes || defaultBantime;
    var command = (( !isNaN(nameOrId)) ? "/banid " : "/ban ")+nameOrId+" "+minutes;
    RCON.send(command);
  },
  echo: function echo(message) {
    var command = "/echo "+'"'+message+'"';
  },
  kick: function kick(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/kickid " : "/kick ")+nameOrId;
    RCON.send(command);
  },
  mute: function mute(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/muteid " : "/mute ")+nameOrId;
    RCON.send(command);
  },
  swap: function swap(id) {
    RCON.send("/swapid "+id);
  },
  freeze: function freeze(id) {
    RCON.send("/freezeid "+id);
  },
  unfreeze: function unfreeze(id) {
    RCON.send("/unfreezeid "+id);
  },
  unban: function unban(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/unbanid " : "/unban ")+nameOrId+" "+minutes;
    RCON.send(command);
  },
  unmute: function unmute(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/unmuteid " : "/unmute ")+nameOrId+" "+minutes;
    RCON.send(command);
  },

  //Currently will not include entries, which ban info has a reason specified -_-
  getBans: function getBans() {
    var deferred = Q.defer();
    Parser.onceOnComposition({
      start: "^LISTING[\\s]BANS",
      content: "(?<login> [\\w-]+)" +
        ",[\\s]+" +
        "(?<ip> \\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})" + //simplified ip, since kag will prolly manage the validity
        ",[\\s]+" +
        "Banned"+
        ",[\\s]+" +
        "(?<time> .*)",
      end: "---------------"
    }, function (bans) {
      deferred.resolve(bans);
    })
    return deferred.promise;
  },
  getMutes: function getMutes() {
    var deferred = Q.defer;
    Parser.onceOnComposition({
      start: "^LISTING[\\s]BANS",
      content: "(?<login> [\\w-]+)" +
        ",[\\s]+" +
        "(?<time> .*)",
      end: "---------------"
    }, function (mutes) {
      deferred.resolve(mutes);
    })
    return deferred.promise;
  },
  loadMap: function loadMap(name) {
    RCON.send("/loadmap "+name);
  },
  loadBitmap: function loadBitmap(name) {
    RCON.send("/loadbitmap "+name);
  },
  restartmap: function restartmap() {
    RCON.send("/restartmap");
  },
  nextMap: function nextMap() {
    RCON.send("/nextmap");
  },
  message: function message(msg) {
    RCON.send("/msg "+name);
  },
  reloadSeclevs: function reloadSeclevs() {
    RCON.send("/reloadseclevs");
  },
  reloadsecurity: function reloadsecurity() {
    RCON.send("/reloadsecurity");
  },
  restartserver: function restartserver() {
    RCON.send("/restartserver");
  }
};

global.Commands = service