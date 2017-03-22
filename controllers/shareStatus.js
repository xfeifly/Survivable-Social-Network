var directory = require('../models/Directory.js');
var socketsForStatus = {};//a map of username and socket


exports.updateSocket = function (connectedUsers) {
    socketsForStatus = connectedUsers;
};

exports.status = function(req, res) {
    var name = req.params.userName;
    var status = req.body;
    directory.findName(name, function(user){
        if(!user){
            res.sendStatus(404);
        } else {
            user.updateStatus(status);
            res.sendStatus(201);
        }
    });
    status.userName = name;
    var socket = socketsForStatus[name];
    console.log("updatestatus");
    console.log(status.userName);
    socket.broadcast.emit('send:status', status);
};