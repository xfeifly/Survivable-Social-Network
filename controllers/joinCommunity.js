var Citizen = require('../models/Citizen.js');
var directory = require('../models/Directory.js');
var _ = require("underscore");
var socketsForCom = {};

exports.initSocket = function (socket, connectedUsers) {
    socket.on('enter lobby', function(name){
        socketsForCom = connectedUsers;
        socket.broadcast.emit('send:join', name);
    });
};

exports.logout = function(req, res, next) {
    var name = req.query.userName;
    if (name) {
        res.clearCookie('userName');
        //console.log(name+' logout');
        res.redirect('/');
        directory.findName(name, function (user) {
            user.updateIsOnline(false);
        });
        console.log("redirect to the root");
        //var socket = socketsForCom[name];
        //socket.broadcast.emit('send:leave', name);
    }
};

exports.login = function(req, res) {
    var name = req.query.userName;
    var pass = req.query.password;
    directory.findName(name, function(user) {
        if (!user) {
            if (directory.checkReservedName(name)) {
                res.send('reserved');
            } else {
                res.send('unused');
            }
        } else if (user.accountStatus == 'Inactive') {
            res.send('inactive')
        } else if (user.isPassMatch(pass)) {
            res.cookie('userName', name);
            user.updateIsOnline(true);
            res.json(user.display());
        } else {
            res.send('wrong');
        }
    });
};

exports.citizen = function(req, res) {
    var name = req.params.userName;
//    console.log(name);
    directory.findName(name, function(user) {
        if (!user) {
            res.sendStatus(404);
        } else {
            res.json(user.display());
        }
    });
};

exports.signup = function(req, res) {
    var name = req.body.userName;
    if(directory.checkReservedName(name)){
        res.send('reserved');
    } else {
        directory.findName(name, function (user) {
            if (!user) {
                var citizen = new Citizen(req.body);
                citizen.updateIsOnline(true);
                citizen.save();
                directory.add(citizen);
                res.cookie('userName', name);
                res.status(201).json(citizen.display());

            } else {
                res.send('used');
            }
        });
    }
};

exports.directory = function(req, res) {
	res.json(directory.display());
};

exports.deleteCitizenDB = function(req, res) {
    directory.deleteCitizenDB();
    res.redirect('/');
    console.log("DB deleted");
};