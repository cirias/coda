'use strict';

var express = require('express');
var controller = require('./room.controller');

var router = express.Router();

router.get('/', controller.query);

module.exports = router;