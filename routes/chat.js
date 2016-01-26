var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ChatModel;

require('../models/chat');
ChatModel = mongoose.model('chat');

router.post('/', function (req, res, next) {
    var body = req.body;
    var myId = req.session.userId;
    var friendId = body.participants['1'];
    var reverse = [body.participants['1'], body.participants['0']];

    var clients = global.ioClients;
    if (clients[friendId]) {
        console.log('to', friendId, body.conversation.text);
        var socket = clients[friendId];
        socket.emit('message', body.conversation);
    }


    ChatModel.update({$or: [{"participants": body.participants}, {"participants": reverse}]},
        {$push: {"conversation":  body.conversation}, "participants":body.participants},
        {
            new: true,
            upsert: true
        },
        function (err, feed) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true});
        });
});

router.get('/:id', function(req, res, next) {
    var myId = req.session.userId;
    var friendId = req.params.id;
    var parts = [myId, friendId];

    ChatModel.findOne({"participants": {$all: parts}},
        {"_id": 0, "conversation": 1},
        {$sort: {"conversation.date": 1}})
        .exec(function (err, chats) {
            /*if (err) {
                return next(err);
            }*/
            res.status(200).send(chats || {});
        });
});

module.exports = router;



