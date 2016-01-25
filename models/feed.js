var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedSchema = new Schema({
    userId: {type: String, required: true},
    dateOfPost: {type: Date, default: Date.now},
    topic: {type: String, required: true},
    text: {type: String, required: true},
    likes: {type: Number, default:0}
});

feedSchema.set('toJSON', {virtual: true});

mongoose.model('feed', feedSchema);