var express = require('express');
var router = express.Router();

var Room = require('../models/room');
var Reservation = require('../models/reservation');

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

router.post('/search', function(req, res, next) {
	var reservation = req.body;

	var currentDate = new Date();
	var start = new Date(req.body.start);
	var end = new Date(req.body.end);

	Room.find({}, function(err, rooms) {
  		if (err) {
  			res.json(err)
  		} else if (!rooms) {
  			return res.json({
  				err: 'No rooms.'
  			})
  		} else {
  			if (!start || !end) {
				return res.json({
		  			err: 'You must enter a valid start and end datetime.'
		  		})
			} else if (end < start) {
		  		return res.json({
		  			err: 'The end date must be after the start time.'
		  		})
		  	} else if (!(start - end)) {
		  		return res.json({
		  			err: 'You must book a room for amount of time.'
		  		})
		  	} else if (start < currentDate) {
		  		return res.json({
		  			err: 'You can\'t book a room for earlier date.'
		  		})
		  	} else {
				var promises = [];
				var filteredRooms = [];                                                                                                  

		  		rooms.forEach(function(room) {
		  			promises.push(Reservation.find({
			  			room: room._id,
		  				$or: [
		  					{ start: { $gte: start }, end: { $lte: end } },
		  					{ start: { $lte: start }, end: { $gte: end } },
		  					{ start: { $gte: start, $lte: end }, end: { $gte: end } },
		  					{ start: { $lte: start }, end: { $lte: end, $gte: start } },
		  				]
			  		}, function(err, reservations) {
			  			if (err) {
			  				return res.json(err)
			  			} else if (reservations && reservations.length === 0) {
			  				filteredRooms.push(room)
			  			}
			  		}))
		  		});

		  		Promise.all(promises)
		  			.then(function() {
		  				res.json(filteredRooms)
		  			})
		  	}
  		}
  	})
});

module.exports = router;
