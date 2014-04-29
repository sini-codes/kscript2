var net = require("net");
var util = require("util");
var EventEmitter = require("events").EventEmitter;


/**
 * Rcon communication class
 * Responsible for:
 * - [Re]connecting to server
 * - Emitting events about connection status and incoming messages
 * @param ip ip to connect to
 * @param port port to connect to
 * @param password server rcon password
 * @param limit message sending time limit, to let the server process stuff correctly before sending next message
 * @constructor
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
  //sending interval id
  var sIntId;

  function forceSend(data) {
    if (!socket)
      return Logger.Warning('Message was not sent, because connection is closed.');

    socket.write(data + '\r\n', 'utf8', function () {
      //console.log("DEBUG: data sent");
    });
  }

  function enableSending() {
    sIntId = setInterval(function () {
      if (lineQueue.length > 0) forceSend(lineQueue.splice(0,1));
    }, limit);
  }

  function disableSending() {
    clearInterval(sIntId);
  }

  //public exposed methods
  this.connect = function (cb) {
    socket.setEncoding("utf8");
    socket.setNoDelay();
    socket.setTimeout(1000);
    socket.connect(port, ip,cb);
  };

  this.send = function (data) {
    lineQueue.push(data);
  };

  //Socket event handling
  socket.on("connect", function onConnect() {
    Logger.KScript2("Connection received! Chilling a bit...");
    connected = true;
    setTimeout(function(){
      Logger.KScript2("Authorizing...");
      forceSend(password);
    },3000)
  });

  socket.on("data", function onData(data) {
    //Have we just connected?
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

    //if(err) console.log(err);

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

  //private methods


}

util.inherits(RconConnection, EventEmitter);

module.exports = new RconConnection(Config.host, Config.port, Config.password, 50);