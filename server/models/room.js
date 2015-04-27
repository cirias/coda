var uuid = require('node-uuid');
var Moniker = require('moniker');
var names = Moniker.generator([Moniker.verb, Moniker.noun], {glue: '-'});
var Game = require('./game');

var rooms = [];
var roomsHash = {};

var Room = function () {
  this.id = uuid.v1();
  this.name = names.choose();
  this.players = [];
  rooms.push(this);
  roomsHash[this.id] = this;
};

Room.get = function (id) {
  return roomsHash[id];
};

Room.query = function (begin, end) {
  return rooms.slice(begin, end);
};

Room.prototype.destroy = function() {
  delete roomsHash[this.id];
  var index = rooms.indexOf(this);
  if (index >= 0)
    rooms.splice(index, 1);
  return;
};

Room.prototype.add = function(player) {
  this.players.push(player);
};

Room.prototype.remove = function(player) {
  var index = this.players.indexOf(player);
  if (index >= 0)
   this.players.splice(index, 1);
  if (this.players.length === 0)
    return this.destroy();
  else
    return this;
};

Room.prototype.allReady = function() {
  return this.players.reduce(function (ready, player) {
    return ready && player.ready;
  }, true);
};

Room.prototype.startGame = function() {
  this.game = new Game(this.players);
  return this.game;
};

module.exports = Room;
