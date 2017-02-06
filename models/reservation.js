// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var reservationSchema = mongoose.Schema({
    title: String,
    room: mongoose.Schema.Types.ObjectId,
    start: Date,
    end: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Reservation', reservationSchema);
