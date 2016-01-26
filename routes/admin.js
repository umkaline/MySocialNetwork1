var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var FeedModel;
var UserModel;

require('../models/feed');
FeedModel = mongoose.model('feed');
require('../models/user');
UserModel = mongoose.model('user');

router.get('/users/', function (req, res, next) {
    UserModel.find({},
        {"password": 0, "admin": 0})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }

            res.status(200).send(users);
        });
});

router.delete('/users/:id', function (req, res, next) {
    var id = req.params.id;

    UserModel.findByIdAndRemove(id, function (err, response) {
        if (err) {
            return next(err);
        }
        UserModel.update({"friends._id": id}, {$pull: {"friends._id": id}})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                FeedModel.remove({"userId": id},function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: 'removed'});
                });
            });

    });
});

router.get('/posts/', function (req, res, next) {
    UserModel.find({})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            usrs = users.map(function(user) {
                return user._id;
            });
            FeedModel.find({})
                .exec(function (err, feeds) {
                    if (err) {
                        return next(err);
                    }

                    feeds = feeds.map(function(feed) {
                        users.forEach(function(user){
                            if (feed.userId == user._id) {
                                feed._doc.photo = user.photo;
                                feed._doc.userName = user.firstName;
                            }
                        });
                        return feed;
                    });
                    res.status(200).send(feeds);
                });
        });
});

router.delete('/posts/:id', function (req, res, next) {
    var id = req.params.id;

    FeedModel.findByIdAndRemove(id, function (err, response) {
        if (err) {
            return next(err);
        }
        res.status(200).send({success: 'removed'});
    });
});

module.exports = router;



