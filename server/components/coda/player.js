var Room = require('./room');
var redis = require('../redis');

var Player = function (socket) {
	var session = socket.session;
	this.id = session.id
	this.name = session.name
	this.roomId = null;
	this.socket = socket;
};

Player.prototype.save = function(callback) {
	redis.hmset('session:' + this.id, {
		id: this.id,
		name: this.name,
		roomId: this.roomId
	}, callback);
};

Player.prototype.createRoom = function(name, callback) {
	var room = new Room(name, function (err) {
		if (err) return callback(err);
		this.join(room, callback);
	});
};

Player.prototype.join = function(room, callback) {
	if (this.roomId) return callback(new Error('Already in room', this.roomId));

	this.roomId = room.id;
	this.socket.join('room:' + this.roomId);
	this.save(function (err) {
		if (err) return callback(err);
		room.addMember(this, callback);
	});
};

Player.prototype.leave = function(callback) {
	if (!this.roomId) return callback();
	this.socket.leave('room:' + this.roomId);
	var room = new Room(this.roomId);
	this.roomId = null;
	this.save(function (err) {
		if (err) return callback(err);
		room.removeMember(this, callback);
	});
};

module.exports = Player;

// Player.prototype.guess = function(who, which, number) {
// 	return who.check(which, number);
// };

// Player.prototype.check = function(which, number) {
// 	return this.cards[which] === number;
// };