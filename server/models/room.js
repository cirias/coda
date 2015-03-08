var fs = require('fs');
var util = require('util');
var _ = require('lodash');
var Model = require('./model');

var ROOM = {
  CREATE: fs.readFileSync(__dirname + '/lua/room.create.lua'),
  DESTROY: fs.readFileSync(__dirname + '/lua/room.destroy.lua'),
  QUERY: fs.readFileSync(__dirname + '/lua/room.query.lua')
};

var Room = function () {
  Model.call(this);
};

util.inherits(Room, Model);

Room.prototype.create = function(room, callback) {
  if (!room.id) return callback(new Error('Undefined room.id'));
  this.redis.eval(ROOM.CREATE, 0, room.id, JSON.stringify(room), callback);
};

Room.prototype.destroy = function(roomId, callback) {
  this.redis.eval(ROOM.DESTROY, 0, roomId, callback);
};

Room.prototype.update = function(room, callback) {
  if (!room.id) return callback(new Error('Undefined room.id'));
  this.redis.set('room:' + room.id, JSON.stringify(room), callback);
};

Room.prototype.retrieve = function(roomId, callback) {
  this.redis.get('room:' + roomId, function (err, data) {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
};

Room.prototype.query = function(start, end, callback) {
  this.redis.eval(ROOM.QUERY, 0, start, end, function (err, result) {
    if (err) return callback(err);
    var result = result.map(function (obj) {
      return JSON.parse(obj);
    });
    callback(null, result);
  });
};

module.exports = new Room();