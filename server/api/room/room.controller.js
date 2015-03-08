'use strict';

var _ = require('lodash');
var async = require('async');
var Room = require('../../models/room');
var Player = require('../../models/player');

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

// Get the room from the id
exports.get = function(req, res, next) {
  if (!req.params.id) return res.status(401).send('The required params "id" is not found');

  Room.retrieve(req.params.id, function (err, room) {
    if (err) return next(err);
    if (!room) return res.status(404).send('Not found');

    room.players = {};
    async.each(room.playerIds, function (playerId, cb) {
      Player.retrieve(playerId, function (err, player) {
        if (err) return cb(err);

        room.players[player.id] = player;
        cb();
      });
    }, function (err) {
      if (err) return next(err);

      res.send(room);
    });
  });
};