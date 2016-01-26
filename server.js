var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var staticUrl = path.join(__dirname, 'public');
var session = require('express-session');
var SessionStorage = require('connect-mongo')(session);
var io = require('socket.io')(http);
var mailer = require("nodemailer");

var env = process.env.NODE_ENV || 'development';
var db;
var opts;


global.ioClients = {};

require('./models/user');
UserModel = mongoose.model('user');

require('./config/' + env);
opts = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
};

mongoose.connect(process.env.DB_HOST, process.env.DB_NAME, parseInt(process.env.DB_PORT, 10), opts);
db = mongoose.connection;

db.once('connected', function () {
    var userRouter = require('./routes/user');
    var feedRouter = require('./routes/feed');
    var chatRouter = require('./routes/chat');
    var adminRouter = require('./routes/admin');

    function onlyAuth(req, res, next) {
        if (req.session && req.session.loggedIn) {
            return next();
        }
        res.status(401).send();
    };

    function onlyAdmin(req, res, next) {
        if (req.session && req.session.isAdmin) {
            return next();
        }
        res.status(401).send();
    };

    process.env.NODE_ENV = 'production';
    console.log('Connected to', process.env.DB_NAME, 'DB');

    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false, limit: 1024 * 1024 * 200}));

    app.use(express.static(staticUrl));
    app.use(session({
        name: 'VRakashy',
        key: "key",
        secret: 'dfhjky4356sjdfbeuy64t5873yfkjshdf98349erfkdhfg984ytkdfh',
        resave: false,
        saveUninitialized: false,
        store: new SessionStorage({
            mongooseConnection: db
        })
    }));

    app.use('/myApi/user', onlyAuth, userRouter);

    app.use('/myApi/feed', onlyAuth, feedRouter);

    app.use('/myApi/chat', onlyAuth, chatRouter);

    app.use('/myApi/admin', onlyAdmin, adminRouter);

    app.post('/login', function (req, res, next) {
        var body = req.body;
        var shaSum;
        var UserModel = mongoose.model('user');

        if (body.password && body.email) {
            UserModel.findOne({
                'email': body.email
            }, function (err, user) {
                if (err) {
                    next(err);
                }
                shaSum = crypto.createHash('sha256');
                shaSum.update(body.password);
                body.password = shaSum.digest('hex');

                if (user) {
                    if (user.password === body.password) {
                        req.session.loggedIn = true;
                        req.session.userId = user._id;

                        if (user.admin) {
                            req.session.isAdmin = true;
                        }

                        return res.status(200).send(user);
                    } else {
                        return res.status(200).send({fail: 'Wrong Password'});
                    }
                } else {
                    return res.status(200).send({fail: 'No Such User'});
                }

                err = new Error();
                err.status = 400;
                next(err);
            });
        } else {
            return res.status(200).send({fail: 'Fill All Fields'});
        }
    });

    app.post('/register', function (req, res, next) {
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

                    if (user.password) {
                        shaSum.update(user.password);
                        user.password = shaSum.digest('hex');
                    }

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

    app.post('/recover', function (req, res, next) {
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


                        var smtpTransport = mailer
                            .createTransport('smtps://vrakashy0101%40gmail.com:vrakashy0102@smtp.gmail.com');


                        var mail = {
                            from: "VRakashy",
                            to: "glmax132@gmail.com",
                            subject: "Password recovery",
                            text: user.recoveryKey,
                            html: "<b>http://localhost:3000/#myApp/recover/" + user.recoveryKey + "</b>"
                        }

                        smtpTransport.sendMail(mail, function (error, response) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Message sent: " + response);
                            }

                            smtpTransport.close();

                        });

                        res.status(200).send({success: true});

                    });
                }
            });
        } else {
            return res.status(200).send({fail: 'Specify Email'});
        }
    });

    app.post('/recover/:recoveryKey', function (req, res, next) {
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

    app.post('/logout', function (req, res, next) {
        req.session.destroy();

        res.status(200).send({success: true});
    });

    io.on('connection', function (socket) {
        console.info('New client connected (id=' + socket.id + ').');

        socket.on('hello', function (_id) {
            if (!global.ioClients[_id]) {
                global.ioClients[_id] = socket;
                socket._id = _id;
            }
        });

        socket.on('disconnect', function () {
            global.ioClients[socket._id] = undefined;
            console.info('Client gone (id=' + socket._id + ').');
        });
    });

    http.listen(3000, function () {
        console.log('listening on *:3000');
    });
})
;
db.on('error', function (err) {
    console.error(err);
});