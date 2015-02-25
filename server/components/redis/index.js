var redis = require('redis');
var client = redis.createClient();

client.on('error', function (err) {
	console.error(err.stack);
});

module.exports = client;