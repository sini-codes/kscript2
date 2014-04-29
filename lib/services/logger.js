var winston = require('winston');
var path = require('path');
var moment = require('moment');


/** Logging files path based on timestamp */
var ts = moment().format('MMMM-D-YYYY-h:mm:ss-a');
var debugPath =  path.join(process.cwd(),'logs',ts+'-debug.log');
var exceptionPath =  path.join(process.cwd(),'logs',ts+'-exceptions.log');

var ks_levels = {
  levels: {
    Server: 0,
    KScript2: 1,
    Warning: 2,
    Failure: 3
  },
  colors: {
    Server: 'cyan  bold',
    KScript2: 'green  bold',
    Warning: 'magenta bold',
    Failure: 'red bold'
  }
};

winston.addColors(ks_levels.colors);

var logger = new (winston.Logger)({
  levels: ks_levels.levels,
  transports: [
    new (winston.transports.Console)({ level:'Server', json: false, timestamp: false,colorize:true, prettyPrint: true }),
    new winston.transports.File({ level:'Warning', filename: debugPath, json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true,prettyPrint: true }),
    new winston.transports.File({ filename: exceptionPath, json: false })
  ],
  exitOnError: false
});
logger.setLevels(ks_levels.levels);


module.exports = logger;/**
 * Created by sinitreo on 4/9/14.
 */
