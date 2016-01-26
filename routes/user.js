var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var router = express.Router();
var UserModel;

require('../models/user');
UserModel = mongoose.model('user');

router.get('/', function (req, res, next) {
    UserModel.findOne({"_id" : req.session.userId},
        {"password":0})
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
        {"password":0})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }

            res.status(200).send(users);
        });
});

router.get('/friends', function (req, res, next) {
    UserModel.find({"friends._id" : req.session.userId},
        {"password":0})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }

            res.status(200).send(users);
        });
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;

    res.status(200).send(id);
});

router.delete('/:id', function (req, res, next) {
    var id = req.params.id;

    UserModel.findByIdAndRemove(id, function (err, response) {
        if (err) {
            return next(err);
        }

        res.status(200).send({success: 'removed'});
    });
});

router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    var body = req.body;


    UserModel.findByIdAndUpdate(id, body, {new: true}, function (err, response) {
        if (err) {
            return next(err);
        }

        res.status(200).send({success: true});
    });
});

module.exports = router;



