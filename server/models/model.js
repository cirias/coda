var redis = require('redis');

var Model = function () {
	this.redis = redis.createClient();
	this.redis.on('error', function (err) {
		console.error(err.stack);
	});
};

module.exports = Model;