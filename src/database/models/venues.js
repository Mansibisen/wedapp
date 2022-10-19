const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
	name: String,
	location: String,
	mobileNo: Number,
	type: String,
	
    Host_id:String,
	packages: [{
		ptype: String,
		description: String,
		charge:String
	}],
	rating:Number,
	reviews: [
		{
			rate: Number ,
			text: String,
            by:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
		},
	],
    Photos:[
		{
			type:String
		},
	],
	avaliabilty: [{
        packageType:String,
		date: String,
		
	}],
	
});

module.exports = mongoose.model('Venue', VenueSchema);
