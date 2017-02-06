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

router.post('/search', function(req, res, next) {
	var reservation = req.body;

	var currentDate = new Date();

	Room.find({}, function(err, rooms) {
  		if (err) {
  			res.json(err)
  		} else if (!rooms) {
  			return res.json({
  				err: 'No rooms.'
  			})
  		} else {
  			if (!res.body.start || !req.body.end) {
				return res.json({
		  			err: 'You must enter a valid start and end datetime.'
		  		})
			} else if (reservation.end < reservation.start) {
		  		return res.json({
		  			err: 'The end date must be after the start time.'
		  		})
		  	} else if (!(reservation.start - reservation.end)) {
		  		return res.json({
		  			err: 'You must book a room for amount of time.'
		  		})
		  	} else if (reservation.start < currentDate) {
		  		return res.json({
		  			err: 'You can\'t book a room for earlier date.'
		  		})
		  	} else {
		  		Reservation.find({
		  			room: reservation.room,
	  				$or: [
	  					{ start: { $gte: reservation.start }, end: { $lte: reservation.end } },
	  					{ start: { $lte: reservation.start }, end: { $gte: reservation.end } },
	  					{ start: { $gte: reservation.start, $lte: reservation.end }, end: { $gte: reservation.end } },
	  					{ start: { $lte: reservation.start }, end: { $lte: reservation.end, $gte: reservation.start } },
	  				]
		  		}, function(err, reservations) {
		  			if (err) {
		  				return res.json(err)
		  			} else if (reservations && reservations.length) {
		  				return res.json({
		  					err: 'A reservation has already been made for this datetime.'
		  				})
		  			} else {
		  				reservation.save(function(err) {
						  	if (err) {
						  		res.json(err);
						  	} else {
						  		res.json({
						  			message: 'Reservation booked succesfully.',
						  			reservation: reservation
						  		});
						  	}
						})
		  			}
		  		})
		  	}
  		}
  	})
});

module.exports = router;
