var Q = require('q');
var defaultBantime = 60;

var service = {
  /**
   * Ban player by username or ID for given amount of minutes
   * @method ban
   * @param {string|number} nameOrId Username or ID of the player
   * @param {number} minutes
   * @return 
   */
  ban: function ban(nameOrId, minutes) {
    minutes = minutes || defaultBantime;
    var command = (( !isNaN(nameOrId)) ? "/banid " : "/ban ")+nameOrId+" "+minutes;
    RCON.send(command);
  },
  /**
   * Just an echo
   * @method echo
   * @param {string} message
   * @return 
   */
  echo: function echo(message) {
    var command = "/echo "+'"'+message+'"';
  },
  /**
   * Kick player by username or ID
   * @method kick
   * @param {string|number} nameOrId Username or ID of the player
   * @return
   */
  kick: function kick(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/kickid " : "/kick ")+nameOrId;
    RCON.send(command);
  },
  /**
   * Mute player by username or ID
   * @method mute
   * @param {string|number} nameOrId Username or ID of the player
   * @return
   */
  mute: function mute(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/muteid " : "/mute ")+nameOrId;
    RCON.send(command);
  },
  /**
   * Swap player by id
   * @method swap
   * @param {number} id Id of the player
   * @return 
   */
  swap: function swap(id) {
    RCON.send("/swapid "+id);
  },
  /**
   * Freeze player by ID
   * @method freeze
   * @param {number} id Id of the player to freeze
   * @return 
   */
  freeze: function freeze(id) {
    RCON.send("/freezeid "+id);
  },
  /**
   * Description
   * @method unfreeze
   * @param {} id
   * @return 
   */
  unfreeze: function unfreeze(id) {
    RCON.send("/unfreezeid "+id);
  },
  /**
   * Description
   * @method unban
   * @param {} nameOrId
   * @return 
   */
  unban: function unban(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/unbanid " : "/unban ")+nameOrId+" "+minutes;
    RCON.send(command);
  },
  /**
   * Description
   * @method unmute
   * @param {} nameOrId
   * @return 
   */
  unmute: function unmute(nameOrId) {
    var command = (( !isNaN(nameOrId)) ? "/unmuteid " : "/unmute ")+nameOrId+" "+minutes;
    RCON.send(command);
  },

  //Currently will not include entries, which ban info has a reason specified -_-
  /**
   * Description
   * @method getBans
   * @return MemberExpression
   */
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
  /**
   * Description
   * @method getMutes
   * @return MemberExpression
   */
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
  /**
   * Description
   * @method loadMap
   * @param {} name
   * @return 
   */
  loadMap: function loadMap(name) {
    RCON.send("/loadmap "+name);
  },
  /**
   * Description
   * @method loadBitmap
   * @param {} name
   * @return 
   */
  loadBitmap: function loadBitmap(name) {
    RCON.send("/loadbitmap "+name);
  },
  /**
   * Description
   * @method restartmap
   * @return 
   */
  restartmap: function restartmap() {
    RCON.send("/restartmap");
  },
  /**
   * Description
   * @method nextMap
   * @return 
   */
  nextMap: function nextMap() {
    RCON.send("/nextmap");
  },
  /**
   * Description
   * @method message
   * @param {} msg
   * @return 
   */
  message: function message(msg) {
    RCON.send("/msg "+name);
  },
  /**
   * Description
   * @method reloadSeclevs
   * @return 
   */
  reloadSeclevs: function reloadSeclevs() {
    RCON.send("/reloadseclevs");
  },
  /**
   * Description
   * @method reloadsecurity
   * @return 
   */
  reloadsecurity: function reloadsecurity() {
    RCON.send("/reloadsecurity");
  },
  /**
   * Description
   * @method restartserver
   * @return 
   */
  restartserver: function restartserver() {
    RCON.send("/restartserver");
  }
};

global.Commands = service