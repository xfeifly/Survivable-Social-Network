/**
 * Created by Ethan on 3/11/16.
 */
var announcementMsg = require('../models/Messages.js');
var connectedSocketsforAnnounce = {};//a map of username and socket
var _ = require('underscore');

exports.initializeAnnouncement = function(connectedUsers) {
    connectedSocketsforAnnounce = connectedUsers;
};

exports.getAllannouncement = function(req, res) {
    //console.log("controller get all the announcement");
    var info = {type: 'announce'};
    announcementMsg.getHistory(info,function(history) {
        if(history.length === 0){
            res.sendStatus(404);
        }else{
            res.json(history);
        }
    });
};

exports.postAnnouncement = function(req, res) {
//    console.log("controller post announcement !");
    var content = req.body;
    //console.log(content);
    if(_.isEmpty(content)){
        res.sendStatus(400);
    }else{
        res.sendStatus(201);
    }
    var socket = {};
    if(req.body.fromName in connectedSocketsforAnnounce){
        socket = connectedSocketsforAnnounce[req.body.fromName];
        socket.broadcast.emit('post:announcement', content);
    }
    var announcement = new announcementMsg(content);
//    console.log(content);
    announcement.save();
};


