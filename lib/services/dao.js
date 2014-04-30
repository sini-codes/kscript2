/**
 * Little service to provide you with datastores - file databases.
 * Underlying NeDB module allows easy manipulation with documents in form of queries.
 */
// KScript2 uses NeDB to provide basic data persistence.
// You can find more at https://github.com/louischatriot/nedb
var Datastore = require('nedb');
var StoreCache = {};
var DBPATH = './db/';

/**
 * Simple object that caches Datastorages taken from underlying Nedb.
 * @constructor DataAccessManager
 */
function DataAccessManager() {

  /**
   * Get a datastore by a given name.
   * @method getDatastore
   * @param {string} datastorage name (will be used as filename for db file)
   * @param {function} callback to run, after storage is opened
   * @return 
   */
  //Only one simple asynchronous method to retrieve db.
  //Datastores are cached, just in case.
  this.getDatastore = function getDatastore(name, cb) {
    cb = cb || function(){};

    if (!/[^/\.]+/.test(name))
      return cb(new Error("no '/' and  no '.' in the datastore name, please :)"));

    //If we already cached one, we return it.
    if (StoreCache[name])
      return cb(null, StoreCache[name]);

    var db = new Datastore({filename: DBPATH + name});

    db.loadDatabase(function (err) {
      if (err) return cb(err);
      //In case single datastorage was requested twice at once, we do not want one copy to overwrite another.
      if (!StoreCache[name]) StoreCache[name] = db;
      cb(null, StoreCache[name]);
    })
  }
}

module.exports = new DataAccessManager();