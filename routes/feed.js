var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var FeedModel;

require('../models/feed');
FeedModel = mongoose.model('feed');

router.get('/', function (req, res, next) {
    FeedModel.find({"userId" : req.session.userId},
        {userId: 0}).exec(function (err, feeds) {
        if (err) {
            return next(err);
        }

        res.status(200).send(feeds);
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

router.get('/:id', function (req, res, next) {
    var id = req.params.id;

    res.status(200).send(id);
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



