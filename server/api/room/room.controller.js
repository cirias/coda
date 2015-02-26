'use strict';

var _ = require('lodash');
var Room = require('../../components/coda/room');

// Get list of rooms
exports.query = function(req, res, next) {
	Room.query({
		pageNum: req.query.page_num,
		pageSize: req.query.page_size
	}, function (err, result) {
		if (err) return next(err);
		res.send(result);
	});
};