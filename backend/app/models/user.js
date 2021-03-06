var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema,
	UASchema	= require('./ua');

var UserSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	avatar: {type: String, required: false},
	email: {type: String, required: true},
	phoneNumber: Number,
	deleted: {type: Boolean, required: true},
	uas: [{type: Schema.Types.ObjectId, ref: 'Ua'}],
	favoris: [{type: Schema.Types.ObjectId, ref: 'Ua'}],
	groupes: [{type: Schema.Types.ObjectId, ref: 'Group'}],  //the groups that it participate
	messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
	facebook_id: {type: String, required: false},
	google_id: {type: String, required: false},
	resetPasswordToken: String,
	resetPasswordExpires: Date
},
{
	timestamps: true
});

mongoose.model('User', UserSchema);

module.exports = UserSchema;
