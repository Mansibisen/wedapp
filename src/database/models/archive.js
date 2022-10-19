const mongoose = require('mongoose');

const ArchiveSchema = new mongoose.Schema({
    clientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
	FeedBack: String, 
	services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
	venues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
    }],
    Photos:[
		{
			type:String
		},
	],
});

module.exports = mongoose.model('Archive', ArchiveSchema);
