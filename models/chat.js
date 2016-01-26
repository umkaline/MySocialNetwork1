var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participantSchema = new Schema({
    _id: {type: String, required: true}
});

var conversationSchema = new Schema({
    sender: participantSchema,
    text: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

var chatSchema = new Schema({
    participants: [String],
    conversation: [conversationSchema]
});

chatSchema.set('toJSON', {virtual: true});

mongoose.model('chat', chatSchema);