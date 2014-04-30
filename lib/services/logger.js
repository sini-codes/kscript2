//Logging service is available as `Logger`

//This service provides means for fancy output and uses `winston` module under the hood.
//It exposes 4 methods:
// - `Logger.KScript2("logged under KScript2 label")`  marks your input with KScript2 label
// - `Logger.Server("logged under Server label")`  marks your input with Server label
// - `Logger.Warning("logged under Warning label")`  marks your input with Warning label
// - `Logger.Failure("logged under Failure label")`  marks your input with Failure label



var winston = require('winston');
var path = require('path');
var moment = require('moment');

/** Logging files path based on timestamp */
var ts = moment().format('MMMM-D-YYYY-h:mm:ss-a');
var debugPath =  path.join(process.cwd(),'logs',ts+'-debug.log');
var exceptionPath =  path.join(process.cwd(),'logs',ts+'-exceptions.log');

//Logging level structure with corresponding colors.
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

//Registering colors.
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
//Registering levels for this instance of logger.
logger.setLevels(ks_levels.levels);


module.exports = logger;/**
 * Created by sinitreo on 4/9/14.
 */
