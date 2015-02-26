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
		res.cookie('session_id', id, {expires: new Date(Date.now() + 86400000)});
		redis.expireat('session:' + id, parseInt(Date.now() / 1000) + 86400, function (err) {
			if (err) return next(err);
			res.send('ok');
		});
	});
};