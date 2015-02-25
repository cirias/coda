var redis = require('../redis');
var KEY = 'rooms';

var Room = function (name, callback) {
	var that = this;

	if (Number.isNumber(name)) {
		redis.lindex(KEY, index, function (err, obj) {
			if (err) return callback(err);
			obj = JSON.parse(obj);
			that.id = index;
			that.name = obj.name;
			that.members = obj.members;
			callback();
		});
	} else {
		this.name = name;
		this.members = [];
		redis.rpush(KEY, JSON.stringify(this), function (err, length) {
			if (err) return callback(err);
			that.id = length - 1;
			callback();
		});
	}
};

Room.prototype.save = function(callback) {
	redis.lset(KEY, JSON.stringify(this), callback);
};

Room.prototype.addMember = function(player, callback) {
	this.members.push(player.id);
	this.save(callback);
};

Room.prototype.removeMember = function(player, callback) {
	this.members.splice(player.id, 1);
	this.save(callback);
};

module.exports = Room;