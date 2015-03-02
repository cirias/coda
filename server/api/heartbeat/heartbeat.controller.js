'use strict';

var _ = require('lodash');

// Get list of heartbeats
exports.index = function(req, res) {
	if (req.cookies['player_id']) {
		res.cookie('player_id', req.cookies['player_id'], {expires: new Date(Date.now() + 86400000)});
	}
	res.send('ok');
};