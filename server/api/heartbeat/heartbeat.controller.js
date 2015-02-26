'use strict';

var _ = require('lodash');

// Get list of heartbeats
exports.index = function(req, res) {
	res.cookie('session_id', req.cookies['session_id'], {expires: new Date(Date.now() + 86400000)});
	res.send('ok');
};