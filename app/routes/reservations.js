var express = require('express');
var router = express.Router();

var Reservation = require('../models/reservation');
var Room = require('../models/room');

router.get('/', function(req, res, next) {
  	Reservation.find({}, function(err, reservations) {
	  	if (err) {
	  		res.json(err);
	  	} else {
	  		res.json(reservations);
	  	}
	})
});

router.get('/:roomId', function(req, res, next) {
	var roomId = req.params.roomId;

  	Reservation.find({room: roomId}, function(err, reservations) {
	  	if (err) {
	  		res.json(err);
	  	} else {
	  		res.json(reservations);
	  	}
 	})
});

router.post('/', function(req, res, next) {
	var reservation = req.body;

	var currentDate = new Date();

	var reservation = new Reservation({
  		room: req.body.roomId,
  		start: new Date(req.body.start),
  		end: new Date(req.body.end),
  	});

  	console.log(reservation);

  	if (!reservation.room) {
		return res.json({
  			err: 'You must enter a room Id.'
  		})
	} else {
		Room.findById(reservation.room, function(err, room) {
	  		if (err) {
	  			res.json(err)
	  		} else if (!room) {
	  			return res.json({
	  				err: 'You must enter a valid room Id.'
	  			})
	  		} else {
	  			if (!reservation.start || !reservation.end) {
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
			  				console.log(reservations);
			  				return res.json({
			  					err: 'A reservation has already been made for this datetime.'
			  				})
			  			} else {
			  				res.json({
					  			message: 'Reservation booked succesfully.',
					  			reservation: reservation
					  		});
			  		// 		reservation.save(function(err) {
							//   	if (err) {
							//   		res.json(err);
							//   	} else {
							//   		res.json({
							//   			message: 'Reservation booked succesfully.',
							//   			reservation: reservation
							//   		});
							//   	}
							// })
			  			}
			  		})
			  	}
	  		}
	  	})
	}
});

module.exports = router;
