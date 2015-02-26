var fs = require('fs');
var _ = require('lodash');
var redis = require('../redis');
var KEY = 'rooms';

var ROOM = {
	CREATE: fs.readFileSync(__dirname + '/lua/room.create.lua'),
	DESTROY: fs.readFileSync(__dirname + '/lua/room.destroy.lua'),
	QUERY: fs.readFileSync(__dirname + '/lua/room.query.lua')
}

var Room = function (name, exist, callback) {
	var that = this;

	if (exist === true) {
		redis.get('room:' + name, function (err, obj) {
			if (err) return callback(err);
			obj = JSON.parse(obj);
			that.id = obj.id;
			that.name = obj.name;
			that.members = obj.members;
			callback();
		});
	} else {
		if (_.isFunction(exist))
			callback = exist;
		var callback = exist;
		this.id = Date.now() + Math.random();
		this.name = name;
		this.members = [];
		redis.eval(ROOM.CREATE, 0, this.id, JSON.stringify(this), callback);
	}
};

Room.prototype.save = function(callback) {
	redis.set('room:' + this.id, JSON.stringify(this), callback);
};

Room.prototype.addMember = function(player, callback) {
	this.members.push(player.id);
	this.save(callback);
};

Room.prototype.removeMember = function(player, callback) {
	this.members.splice(player.id, 1);
	this.save(callback);
};

Room.query = function (params, callback) {
	params.pageNum = params.pageNum || 1;
	params.pageSize = params.pageSize || 10;
	var start = (params.pageNum - 1) * params.pageSize;
	var stop = start + params.pageSize - 1;
	redis.eval(ROOM.QUERY, 0, start, stop, function (err, result) {
		if (err) return callback(err);
		var result = result.map(function (obj) {
			return JSON.parse(obj);
		});
		callback(null, result);
	});
};

module.exports = Room;