'use strict';

var _ = require('lodash');
var Room = require('../../models/room');

// Get list of rooms
exports.query = function(req, res, next) {
  req.query.page_num = req.query.page_num || 1;
  req.query.page_size = req.query.page_size || 10;

  var start = (req.query.page_num - 1) * req.query.page_size;
  var end = req.query.page_num * req.query.page_size;
  
  Room.query(start, end, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
};