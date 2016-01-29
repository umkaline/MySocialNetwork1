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


var env = process.env.NODE_ENV || 'development';
var db;
var opts;

console.log('lsknclsandcjnslcksckljndckjsndkcjnsekjcnse');
console.log('lsknclsandcjnslcksckljndckjsndkcjnsekjcnse');
console.log('lsknclsandcjnslcksckljndckjsndkcjnsekjcnse');
console.log('lsknclsandcjnslcksckljndckjsndkcjnsekjcnse');

global.ioClients = {};

require('./models/user');
UserModel = mongoose.model('user');
require('./models/chat');
ChatModel = mongoose.model('chat');

require('./config/' + env);
opts = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
};

mongoose.connect(process.env.DB_HOST, process.env.DB_NAME, parseInt(process.env.DB_PORT, 10), opts);
db = mongoose.connection;

db.once('connected', function () {
    var miscRouter = require('./routes/misc');
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

    app.use('/', miscRouter);

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
            UserModel.findByIdAndUpdate(socket._id, {$set: {"logOutDate": new Date()}}, {new: true},
                function () {
                });
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