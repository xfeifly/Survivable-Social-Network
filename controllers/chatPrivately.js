

var ioforPrivate = {};
var privateMsg = require('../models/Messages.js');
var _ = require('underscore');
var multer = require('multer');


exports.initializeChatPrivately = function(socket, connectedUsers, io) {
    var db = require('../config/db.js');
    socket.on("private chat", function(data) {
        roomId = computeRoomId(data.fromName,data.toName);
        console.log("roomid: " + roomId);
        socket.join(roomId);
        connectedUsers[data.toName].join(roomId);

        ioforPrivate = io;

        socket.emit("initalize private chat room", {roomId:roomId, toName: data.toName, fromName: data.fromName});
    });
};

exports.postPrivateMsg = function(req, res) {
    var db = require('../config/db.js');

    var data = req.body;
    data.filename = "";
    if(_.isEmpty(data)){
        res.sendStatus(400);
    }else{
        res.sendStatus(201);
    }
    var privatemsg = new privateMsg(data);
    privatemsg.save();
    console.log("private message posted in server, about to emit to clients in room:" + data.roomId);
    ioforPrivate.in(data.roomId).emit("private chat message", data);
};

exports.postPrivatePicName = function(req,res){
    console.log("in postPrivatePicName");
    //if(req.file !== undefined){
        var filedata = req.file;
        var filename = {filename: filedata.filename};
    //}
    console.log(filedata);
    res.json(filename);
};

exports.postPrivatePic = function(req, res) {
    console.log("in postPrivatePic");
    var data = req.query;
    console.log(data);
    data.message = "";
    var privatemsg = new privateMsg(data);
    privatemsg.save();
    ioforPrivate.in(data.roomId).emit("post picture", data);
    res.sendStatus(201);
};

exports.getPrivateChatMsg = function(req, res) {
    //var userName = req.query.userName;
    var roomId = req.query.roomId;
    var info = {type:'private', roomId: roomId};
    console.log("get the request");
    privateMsg.getHistory(info, function(history){
        if(history.length === 0){
            res.sendStatus(404);
        } else{
            res.json(history);
        }
    });
};
function computeRoomId(fromName, toName) {
    var roomIdstring = fromName + toName;
    var roomIdnumber = 0;
    for (var i=0; i< roomIdstring.length; i++){
        roomIdnumber = roomIdnumber + roomIdstring.charCodeAt(i);
    }
    return roomIdnumber;
}

function checkObjectContent(data){
    var txt = "";
    var file = data;
    for (var x in file){
        txt += "[" + x + ":" + file[x] + "], ";
    }
    return txt;
}