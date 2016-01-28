var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var router = express.Router();
var UserModel;

require('../models/user');
UserModel = mongoose.model('user');

router.get('/', function (req, res, next) {
    UserModel.findOne({"_id" : req.session.userId},
        {"password":0, "admin": 0, "recoveryKey": 0, "registrationKey": 0})
        .exec(function (err, users) {
        if (err) {
            return next(err);
        }

        res.status(200).send(users);
    });
});

router.get('/searchFriends', function (req, res, next) {
    UserModel.find({"friends._id" : {$ne: req.session.userId},
                    "_id": {$ne: req.session.userId}},
        {"password":0, "admin": 0, "recoveryKey": 0, "registrationKey": 0})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }

            res.status(200).send(users);
        });
});

router.get('/friends', function (req, res, next) {
    UserModel.find({"friends._id" : req.session.userId},
        {"password":0, "admin": 0, "recoveryKey": 0, "registrationKey": 0})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }

            res.status(200).send(users);
        });
});


router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    var body = req.body;
    var shaSum;

    if (body.password) {
        shaSum = crypto.createHash('sha256');
        shaSum.update(body.password);
        body.password = shaSum.digest('hex');
    }


    UserModel.findByIdAndUpdate(id, body, {new: true}, function (err, response) {
        if (err) {
            return next(err);
        }

        res.status(200).send({success: true});
    });
});

router.put('/newFriend/:id', function (req, res, next) {
    var friendId = req.params.id;
    var myId = req.session.userId;
    var newfriend = {_id: friendId};

    UserModel.findByIdAndUpdate(myId, {$addToSet: {"friends": newfriend}}, {new: true}, function (err, response) {
        if (err) {
            return next(err);
        }

        newfriend = {_id: myId};

        UserModel.findByIdAndUpdate(friendId, {$addToSet: {"friends": newfriend}}, {new: true}, function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true});
        });
    });
});

router.delete('/friend/:id', function (req, res, next) {
    var friendId = req.params.id;
    var myId = req.session.userId;
    var friend = {_id: friendId};

    UserModel.findByIdAndUpdate(myId, {$pull: {"friends": friend}}, {new: true}, function (err, response) {
        if (err) {
            return next(err);
        }

        friend = {_id: myId};

        UserModel.findByIdAndUpdate(friendId, {$pull: {"friends": friend}}, {new: true}, function (err, response) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: true});
        });
    });
});

module.exports = router;



