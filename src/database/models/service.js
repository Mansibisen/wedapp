const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
	type: String,
	subType: String,
	charge: Number,
	name: String,
	info: String,
    rating:Number,
    Address: String,
	Host_id:String,
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
	theme: [String],
	Photos:[
		{
			type:String
		},
	],
	
	
	avaliabilty: [{
        packageType:String,
		date: String,
		
	}],
	packages: [{
		ptype: String,
		description: String,
		charge:String
	}],
});

module.exports = mongoose.model('Service', ServiceSchema);
