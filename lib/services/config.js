/**
 * Service is available as 'Config'
 * It handles:
 * - Mods and global settings
 * - Auto generation of properties in main config
 *
 * Each mod, which exposes default.json file, containing default settings,
 * can access his config properties as Config.modname.someprop
 *
 */


/** Requirements **/
var path = require('path');
var fs = require('fs');
var Logger = require(process.cwd() + '/lib/services/logger');
var argv = require('minimist')(process.argv.slice(2));

/** Global module variables **/
var pathToMainConfig = path.join(process.cwd(), argv.c || "config.json"),
  newMainConfig = false,
  newConfigs = false,
  Config,
  mainConfigTemplate = {
    "host": "127.0.0.1",
    "port": "50301",
    "password": "voper",
    "mods": [
      "stats",
      "info",
      "me",
      "chat",
      "injector",
      "players",
      "ranks_mongo"
    ]
  };

//Getting existing config or
if(fs.existsSync(pathToMainConfig))
  Config = jsonfToObject(pathToMainConfig);
else
  newMainConfig = Config = mainConfigTemplate;

for (var i = 0; i < Config.mods.length; i++) {
  var modeName = Config.mods[i],
  defaultPath = path.join(process.cwd(), "mods/" + modeName + "/default.json"),
  defConf;

  if (fs.existsSync(defaultPath)) {
    //reading default
    try {
      defConf = jsonfToObject(defaultPath);
    } catch (err) {
      Logger.Failure(err.toString());
      Logger.Warning("Sorry, can't read default config of " + modeName + " mod :(");
    }

    //if we don't have it
    if (!Config[modeName])
      newConfigs = Config[modeName] = defConf;
    else //Checking the properties
      for (var prop in defConf)
        if (defConf.hasOwnProperty(prop) && !Config[modeName].hasOwnProperty(prop))
          newConfigs = Config[modeName][prop] = defConf[prop];

  }
}


if (newConfigs || newMainConfig) {
  saveToFile(Config, pathToMainConfig);
  var msg = "";
  if (newMainConfig)
    msg += "New config has been generated for you at " + pathToMainConfig + ". Fill it with correct data and try again.\r\n";
  if (newConfigs)
    msg += "New configs required by mods have been added to your main config. Fill it with correct data and try again.\r\n";
  Logger.Warning(msg);
  process.exit(0);
}

/**
 * Transforms json from file to object
 * @param path to json file
 * @returns Object representing json
 */
function jsonfToObject(path) {
  var result, content;
  try {
    content = fs.readFileSync(path, {encoding: 'utf8'});
  } catch (err) {
    Logger.Failure('Sorry, I can\'t find ' + path + "\r\nAre you sure sure this file exists?");
    process.exit(1);
  }
  try {
    result = JSON.parse(content);
  } catch (err) {
    Logger.Failure(err.toString());
    Logger.Failure('Sorry, I can\'t parse JSON at ' + path);
  }
  return result;
}

/**
 * Save object to json file
 * @param obj object to save
 * @param path path to file where to save
 */
function saveToFile(obj, path) {
  var content = JSON.stringify(obj, null, 2)
  fs.writeFileSync(path, content);
}


/** Exporting Config service **/
module.exports = Config;
