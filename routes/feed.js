var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var FeedModel;
var UserModel;

require('../models/feed');
FeedModel = mongoose.model('feed');
require('../models/user');
UserModel = mongoose.model('user');

router.get('/', function (req, res, next) {
    FeedModel.find({"userId": req.session.userId},
        {userId: 0}).exec(function (err, feeds) {
        if (err) {
            return next(err);
        }

        res.status(200).send(feeds);
    });
});

router.get('/news', function (req, res, next) {
    UserModel.find({"friends._id": req.session.userId})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            usrs = users.map(function(user) {
                return user._id;
            });
            FeedModel.find({"userId": {$in: usrs}})
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

router.post('/', function (req, res, next) {
    var body = req.body;
    body.userId = req.session.userId;
    var feed = new FeedModel(body);

    feed.save(function (err, feed) {
        if (err) {
            return next(err);
        }
        res.status(200).send({success: true});
    });
});

router.put('/like/:id', function (req, res, next) {
    var body = req.body;
    var id = req.params.id;

    FeedModel.findByIdAndUpdate(id, body, {new: true}, function (err, response) {
        if (err) {
            return next(err);
        }
        res.status(200).send({success: true});
    });
});


router.delete('/:id', function (req, res, next) {
    var id = req.params.id;

    FeedModel.findByIdAndRemove(id, function (err, response) {
        if (err) {
            return next(err);
        }
        res.status(200).send({success: 'removed'});
    });
});

module.exports = router;



