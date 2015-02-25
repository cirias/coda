'use strict';

var _ = require('lodash');
var redis = require('../../components/redis');

// Get list of setups
exports.index = function(req, res, next) {
  var id = Date.now() + require('crypto').createHash('sha1').update(Math.random().toString()).digest('hex');
	redis.hmset('session:' + id, {
		id: id,
		name: req.body.name
	}, function (err) {
		if (err) return next(err);
		var timestamp = Date.now() + 900000;
		res.cookie('session_id', id, {expires: new Date(timestamp)});
		redis.expireat('session:' + id, timestamp, function (err) {
			if (err) return next(err);
			res.send('ok');
		});
	});
};