var directory = require('../models/Directory.js');
var socketsForAdmin = {};//a map of username and socket

exports.updateSocket = function (connectedUsers) {
    socketsForAdmin = connectedUsers;
};

exports.activate = function(req, res) {
    var name = req.params.userName;
    var senderName = req.cookies.userName;
    var sent = false;
    directory.findName(senderName, function (user) {
        if(user.privilege != 'Administrator') {
            res.send('unable');
            sent = true;
        }
    });
    if(sent) return;
    directory.findName(name, function(user){
        if(!user){
            res.sendStatus(404);
        } else {
            user.updateAccount(true);
            res.sendStatus(200);
            var socket = socketsForAdmin[senderName];
            socket.broadcast.emit('send:active', name);
        }
    });
};

exports.deactivate = function(req, res) {
    var name = req.params.userName;
    var senderName = req.cookies.userName;
    var sent = false;
    directory.findName(senderName, function (user) {
        if(user.privilege != 'Administrator') {
            res.send('unable');
            sent = true;
        }
    });
    if(sent) return;
    directory.findName(name, function (user) {
        if (!user) {
            res.sendStatus(404);
        } else {
            user.updateAccount(false);
            res.sendStatus(200);
            var socket = socketsForAdmin[senderName];
            socket.broadcast.emit('send:inactive', name);
        }
    });
};

exports.updateProfile = function(req, res) {
    var senderName = req.cookies.userName;
    var name = req.params.userName;
    var data = req.body;
    var sent = false;
    directory.findName(senderName, function (user) {
       if(user.privilege != 'Administrator') {
           res.send('unable');
           sent = true;
       }
    });
    if(sent) return;
    directory.findName(name, function (user) {
        if (!user) {
            res.sendStatus(404);
        } else {
            if (data.newName != 'NotSet') {
                if (directory.checkReservedName(data.newName)) {
                    res.send('reserved');
                    sent = true;
                } else {
                    directory.findName(data.newName, function (isUsed) {
                        if (!isUsed) {
                            user.changeName(data.newName);
                        } else {
                            res.send('used');
                            sent = true;
                        }
                    });
                }
            }
            if(!sent) {
                if (data.newPassword != 'NotSet') {
                    user.changePassword(data.newPassword);
                }
                if (data.newPrivilege != 'NotSet') {
                    user.changePrivilege(data.newPrivilege);
                }
                res.sendStatus(201);
                var socket = socketsForAdmin[senderName];
                socket.broadcast.emit('updateProfile', data);
            }
        }
    });
};