var util = require('util');
var _ = require('lodash');
var config = require('../config/environment');
var Model = require('./model');

var Player = function () {
	Model.call(this);
};

util.inherits(Player, Model);

Player.prototype.create = function(player, callback) {
	if (!player.id) return callback(new Error('Undefined player.id'));
	this.redis.setex('player:' + player.id, config.redis.expiration, JSON.stringify(player), callback);
};

Player.prototype.destroy = function(playerId, callback) {
	this.redis.del('player:' + playerId, callback);
};

Player.prototype.update = function(player, callback) {
	if (!player.id) return callback(new Error('Undefined player.id'));
	this.redis.setex('player:' + player.id, config.redis.expiration, JSON.stringify(player), callback);
};

Player.prototype.retrieve = function(playerId, callback) {
	this.redis.get('player:' + playerId, function (err, data) {
		if (err) return callback(err);
		callback(null, JSON.parse(data));
	});
};

module.exports = new Player();