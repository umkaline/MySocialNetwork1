var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var friendsSchema = new Schema({
    _id: {type: String, required: true}
});
var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: String,
    dateOfBirth: {type: Date, default: Date.now, required: true},
    address: String,
    recoveryKey: String,
    registrationKey: String,
    logOutDate: Date,
    location: { type: [Number], index: '2dsphere'},
    friends: [friendsSchema],
    admin: Boolean,
    photo: {type: String,
        default: "http://www.gravatar.com/avatar/ee22680775bac8568077181682ca6107?s=47&d=http%3A%2F%2Fwww.techrepublic.com%2Fbundles%2Ftechrepubliccore%2Fimages%2Ficons%2Fstandard%2Ficon-user-default.png"},
});

userSchema.set('toJSON', {virtual: true});

mongoose.model('user', userSchema);