/**
 * Lil service to provide you with Datastores
 * to persist data on disk in the db folder
 * It only caches datastores. The entire db layer is handled by Nedb module.
 */

var Datastore = require('nedb')

function DataAccessManager() {

  //private
  var StoreCache = {};
  var DBPATH = './db/';   //PROPOSAL READ FROM CONFIG? Nah, too lazy. DB folder is just fine

  this.getDatastore = function getDatastore(name, cb) {
    if (!/[^/\.]+/.test(name))
      return cb(new Error("no '/' and  no '.' in the datastore name, please :)"));

    if (StoreCache[name])
      return cb(null, StoreCache[name]);

    var db = new Datastore({filename: DBPATH + name});
    db.loadDatabase(function (err) {
      if (err) return cb(err);
      if (!StoreCache[name]) StoreCache[name] = db;
      cb(null, StoreCache[name]);
    })
  }
}

module.exports = new DataAccessManager();