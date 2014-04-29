/**
 * Global service which handles events emitting and subscription.
 * @type {EventEmitter}
 */

var eventEmitter = require('events').EventEmitter;
//Not much really, huh
module.exports = new eventEmitter();