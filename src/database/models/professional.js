const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
	type: String,
	subtype: String,
	charge: Number,
	DesignerName: String,
	decor: String,
    rating:Number,
    location: String,
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
			,
		},
	],
	venues :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
        }
    ],
    services :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
        }
    ]
});

module.exports = mongoose.model('Professional', professionalSchema);
