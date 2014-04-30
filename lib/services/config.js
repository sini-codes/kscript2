//
// Service is available as 'Config'
// It handles:
// - Mods and global settings
// - Auto generation of properties in main config
//
// Each mod, which exposes `default.json` file, containing default settings,
// can access his config properties as `Config.modname.someprop`.
// Check "Making a configurable mod" section
//


var path = require('path');
var fs = require('fs');

//Minimist guy deserialzes cmd arguments into json
var argv = require('minimist')(process.argv.slice(2));


var pathToMainConfig = path.join(process.cwd(), argv.c || "config.json"),
  newMainConfig = false,
  newConfigs = false,
  Config,
  mainConfigTemplate = {
    "host": "127.0.0.1",
    "port": "50301",
    "password": "mumba",
    "mods": [
      "info",
      "chat",
      "players",
    ]
  };

//Getting existing config or
if(fs.existsSync(pathToMainConfig))
  Config = jsonfToObject(pathToMainConfig);
else
  newMainConfig = Config = mainConfigTemplate;

//For each mod in the list we check, if it is configured properly and does not need any new values.
for (var i = 0; i < Config.mods.length; i++) {
  var modName = Config.mods[i],
  defaultPath = path.join(process.cwd(), "mods/" + modName + "/default.json"),
  defConf;
  //We first load the default configuration
  if (fs.existsSync(defaultPath)) {

    try {
      defConf = jsonfToObject(defaultPath);
    } catch (err) {
      Logger.Failure(err.toString());
      Logger.Warning("Sorry, can't read default config of " + modName + " mod :(");
    }

    //In case we do not have a config for a specific mod, which requires it,
    if (!Config[modName])
      //we make sure, that his default config will be included into the main configuration file
      newConfigs = Config[modName] = defConf;
    else
    //Incase configuration for this mod exists, we check each property.
      for (var prop in defConf)
        //If current configuration lacks a particular property, we add it. We never overwrite existing configuration.
        if (defConf.hasOwnProperty(prop) && !Config[modName].hasOwnProperty(prop))
          newConfigs = Config[modName][prop] = defConf[prop];

  }
}

//Notify the user about new configs and quit. Should be moved to app.js, tbh.
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
 * @method jsonfToObject
 * @param path to json file
 * @return result
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
 * @method saveToFile
 * @param obj object to save
 * @param path path to file where to save
 * @return 
 */
function saveToFile(obj, path) {
  var content = JSON.stringify(obj, null, 2)
  fs.writeFileSync(path, content);
}


/** Exporting Config service **/
module.exports = Config;
