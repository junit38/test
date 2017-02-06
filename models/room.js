// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var roomSchema = mongoose.Schema({
    name: String,
    description: String,
    capacity: Number,
    equipements: [{
    	"name": String
    }],
    createdAt: Date,
    updatedAt: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Room', roomSchema);
