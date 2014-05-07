//Remote control service is available as `RCON`

//It provides means of sending data to server as well as reading raw input.
//Two public methods are exposed:
// - RCON.connect() - initiate connection
// - RCON.send() - send string message to server. Message will be automatically appended with \r\n

var net = require("net");
var util = require("util");
var EventEmitter = require("events").EventEmitter;

/**
 * Rcon communication class
 * Responsible for:
 * - [Re]connecting to server
 * - Emitting events about connection status and incoming messages
 * @constructor
 * @method RconConnection
 * @param ip ip to connect to
 * @param port port to connect to
 * @param password server rcon password
 * @param limit message sending time limit, to let the server process stuff correctly before sending next message
 * @return 
 */
function RconConnection(ip, port, password, limit) {

  //private variables
  limit = limit || 50;
  var self = this;
  var socket = new net.Socket();
  var connected = false;
  var authorized = false;
  var lineQueue = [];
  var wasConnected = false;
  var data = "";

  var sIntId;

  /**
   * True send function
   * @method forceSend
   * @param {} data
   * @return 
   */
  function forceSend(data) {
    if (!socket)
      return Logger.Warning('Message was not sent, because connection is closed.');

    socket.write(data + '\r\n', 'utf8', function () {
      /*console.log("DEBUG: data sent")*/
    });
  }


  /**
   * Initate connection
   * @method connect
   * @param {function} Callback to be called after the operation is complete
   * @return
   */
  this.connect = function (cb) {
    socket.setEncoding("utf8");
    socket.setNoDelay();
    socket.setTimeout(1000);
    socket.connect(port, ip,cb);
  };

  /**
   * Description
   * @method send
   * @param {} data
   * @return
   */
  this.send = function (data) {
    lineQueue.push(data);
  };

  /**
   * Enable sending messages to server
   * @method enableSending
   * @return 
   */
  function enableSending() {
    sIntId = setInterval(function () {
      if (lineQueue.length > 0) forceSend(lineQueue.splice(0,1));
    }, limit);
  }

  /**
   * Stop sending messages to server
   * @method disableSending
   * @return 
   */
  function disableSending() {
    clearInterval(sIntId);
  }

  //Socket events handling
  socket.on("connect", function onConnect() {
    Logger.KScript2("Connection received! Chilling a bit...");
    connected = true;
    setTimeout(function(){
      Logger.KScript2("Authorizing...");
      forceSend(password);
    },3000)
  });

  socket.on("data", function onData(data) {

    if (!authorized){
      authorized = true;
      Logger.KScript2("Authorized! Hello, server! :)");
      enableSending();
      if(!wasConnected) self.emit('connect');
      else {
        console.log("emitting reconnect");
        self.emit('reconnect')
      }
      wasConnected = true;
    }

    self.emit("message",data);
  });

  socket.on("error", function onError(e) {
    if(wasConnected){
    } else {
      Logger.Failure("Server is not responding. Is server running? Are ip and port correct?")
    }
   });

  socket.on("close", function onClose(err) {

    if(!connected && !wasConnected) return;
    if(connected && !authorized){
      connected = false;
      return Logger.Failure("Server authentication error! Check your password and sv_tcpr! :)");
    }

    if(connected){
      disableSending();
      self.emit('close');
      Logger.Warning("Connection with server is lost.");
    } else {
      Logger.Warning("Still no connection.");
    }
    connected = false;
    authorized = false;
    Logger.Warning("Reconnecting in 5 seconds...");
    setTimeout(function () {
      self.connect();
    }, 5000);
  });

}

util.inherits(RconConnection, EventEmitter);

module.exports = new RconConnection(Config.host, Config.port, Config.password, 50);