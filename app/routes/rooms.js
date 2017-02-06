var express = require('express');
var router = express.Router();

var Room = require('../models/room');

router.get('/', function(req, res, next) {
	Room.find({}, function(err, rooms) {
	  	if (err) {
	  		res.json(err);
	  	} else {
	  		res.json(rooms);
	  	}
	})
});

router.get('/:roomId', function(req, res, next) {
	var roomId = req.params.roomId;

  	Room.findOne({_id: roomId}, function(err, room) {
	  	if (err) {
	  		res.json(err);
	  	} else {
	  		res.json(room);
	  	}
 	})
});


module.exports = router;
