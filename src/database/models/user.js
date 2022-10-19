const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	address: String,
	mobileNo: Number,
	emailId:String,
    pincode:Number,
	password :String,
	role:String,
	serviceused:[
		{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
        }
	],
	venueused:[
		{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
        }
	],
	servicecreated:[
		{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
        }
	],
	venuecreated:[
		{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
        }
	],

    

	
});

module.exports = mongoose.model('User', UserSchema);
