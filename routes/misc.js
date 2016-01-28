var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var sendMail = require("../helpers/mailSender");
var router = express.Router();
var UserModel;

require('../models/user');
UserModel = mongoose.model('user');

router.post('/login', function (req, res, next) {
    var body = req.body;
    var shaSum;
    var UserModel = mongoose.model('user');

    if (body.password && body.email) {
        UserModel.findOne({
            'email': body.email
        }, {"recoveryKey": 0}, function (err, user) {
            if (err) {
                next(err);
            }
            shaSum = crypto.createHash('sha256');
            shaSum.update(body.password);
            body.password = shaSum.digest('hex');

            if (user) {
                if (!user.registrationKey) {
                    if (user.password === body.password) {
                        req.session.loggedIn = true;
                        req.session.userId = user._id;
                        req.session.myLocation = user.location;

                        if (user.admin) {
                            req.session.isAdmin = true;
                        }

                        var resp = user.toJSON();

                        delete resp.password;
                        delete resp.admin;
                        delete resp.recoveryKey;
                        delete resp.registrationKey;

                        return res.status(200).send(resp);
                    } else {
                        return res.status(200).send({fail: 'Nope... Try Again.'});
                    }
                } else {
                    return res.status(200).send({fail: 'Account not activated yet. Please check your mail'});
                }
            } else {
                return res.status(200).send({fail: 'Nope... Try Again.'});
            }

            err = new Error();
            err.status = 400;
            next(err);
        });
    } else {
        return res.status(200).send({fail: 'Fill All Fields'});
    }
});

router.post('/register', function (req, res, next) {
    var body = req.body;
    var UserModel = mongoose.model('user');

    if (body.email) {
        UserModel.findOne({
            'email': body.email
        }, function (err, user) {
            if (err) {
                next(err);
            }
            if (user) {
                return res.status(200).send({fail: 'Email Allready Registered'});
            } else {
                var user = new UserModel(req.body);
                var shaSum = crypto.createHash('sha256');
                var shaSum1 = crypto.createHash('sha256');

                if (user.password) {
                    shaSum.update(user.password);
                    user.password = shaSum.digest('hex');

                    shaSum1.update(String(Date.now()));
                    user.registrationKey = shaSum1.digest('hex');
                }

                var origin = req.headers.referer;
                var to = body.email;
                var subject = "Account registration confirmation";
                var text =  user.registrationKey;
                var html = "<b>" + origin + "#myApp/activate/" + user.registrationKey + "</b>";

                sendMail(to, subject, text, html);

                user.save(function (err, _user) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: true});
                });
            }
        });
    } else {
        return res.status(200).send({fail: 'Specify Email'});
    }
});

router.post('/activate/:registrationKey', function (req, res, next) {
    var UserModel = mongoose.model('user');
    var registrationKey = req.params.registrationKey;

    UserModel.findOne({
        'registrationKey': registrationKey
    }, function (err, user) {
        if (err) {
            next(err);
        }
        if (!user) {
            return res.status(200).send({fail: "User allready activated or doesn't exist"});
        } else {

            user.registrationKey = undefined;

            user.save(function (err, _user) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: true});
            });
        }
    });
});

router.post('/recover', function (req, res, next) {
    var body = req.body;
    var UserModel = mongoose.model('user');

    if (body.email) {
        UserModel.findOne({
            'email': body.email
        }, function (err, user) {
            if (err) {
                next(err);
            }
            if (!user) {
                return res.status(200).send({fail: 'Email Not Registered'});
            } else {

                var shaSum = crypto.createHash('sha256');
                shaSum.update(String(Date.now()));
                user.recoveryKey = shaSum.digest('hex');

                user.save(function (err, _user) {
                    if (err) {
                        return next(err);
                    }

                    var origin = req.headers.referer;
                    var to = body.email;
                    var subject = "Password recovery";
                    var text =  user.recoveryKey;
                    var html = "<b>" + origin + "#myApp/recover/" + user.recoveryKey + "</b>";

                    sendMail(to, subject, text, html);

                    res.status(200).send({success: true});

                });
            }
        });
    } else {
        return res.status(200).send({fail: 'Specify Email'});
    }
});

router.post('/recover/:recoveryKey', function (req, res, next) {
    var body = req.body;
    var recoveryKey = req.params.recoveryKey;
    var shaSum;
    var UserModel = mongoose.model('user');

    if (body.password) {
        UserModel.findOne({
            'recoveryKey': recoveryKey
        }, function (err, user) {
            if (err) {
                next(err);
            }
            shaSum = crypto.createHash('sha256');
            shaSum.update(body.password);
            body.password = shaSum.digest('hex');

            if (user) {
                user.password = body.password;
                user.recoveryKey = undefined;
                user.save(function (err, _user) {
                    if (err) {
                        return next(err);
                    }
                    return res.status(200).send({success: true});
                });
            } else {
                return res.status(200).send({fail: 'Recovery key is not valid'});
            }
        });

    } else {
        return res.status(200).send({fail: 'No password specified'});
    }
});

router.post('/logout', function (req, res, next) {
    req.session.destroy();

    res.status(200).send({success: true});
});

module.exports = router;



