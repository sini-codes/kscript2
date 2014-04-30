/**
 * Global service which handles events emitting and subscription.
 * @type {EventEmitter}
 */
//The service is available as `GameEvents`
//It is just a proxy to convinient NodeJS EventEmitter
//Refer [here](http://nodejs.org/api/events.html) for awesome documentation.
var eventEmitter = require('events').EventEmitter;
module.exports = new eventEmitter();
//Not much really, huh
