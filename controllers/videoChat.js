/**
 *
 * videochat server side
 */

var ioforPrivate = {};
var privateMsg = require('../models/Messages.js');
var _ = require('underscore');

exports.initializeVideoChat = function(socket, connectedUsers, io) {
    socket.on("video chat", function(data) {
        roomId = computeRoomId(data.fromName,data.toName);//the same with videoroomId
        console.log("message roomid: " + roomId + "for " + data.fromNam + " and " + data.toName );
        //console.log("message data: " + data);
        //join to a joint room
        socket.join(roomId);
        connectedUsers[data.toName].join(roomId);
        ioforPrivate = io;
        //ioforPrivate.in(data.roomId).emit("video chat message", data);
        ioforPrivate.in(roomId).emit("video chat message", data);

    });
};




//calculate roomId
function computeRoomId(fromName, toName) {
    var roomIdstring = fromName + toName + "videochat";
    var roomIdnumber = 0;
    for (var i=0; i< roomIdstring.length; i++){
        roomIdnumber = roomIdnumber + roomIdstring.charCodeAt(i);
    }
    return roomIdnumber;
}