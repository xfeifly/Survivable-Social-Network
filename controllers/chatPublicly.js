/**
 * Created by feixu on 3/10/16.
 */

var connectedSocketsforPub = {};//a map of username and socket
var publicMsg = require('../models/Messages.js');

exports.initializeChatPublicly = function (socket, connectedUsers) {

    var db = require('../config/db.js');

    socket.on('enter lobby', function(data){
        console.log(data + 'user in the lobby');
        connectedUsers[data] = socket;
        connectedSocketsforPub = connectedUsers;
    });
};

exports.postPublicMsg = function(req,res) {
    var pubChatcontent = req.body;
    var socket = connectedSocketsforPub[req.body.fromName];
    socket.broadcast.emit('send:message', pubChatcontent);
    var publicmsg = new publicMsg(pubChatcontent);
    publicmsg.save();
    res.sendStatus(201);
};

exports.postPublicPicName = function(req,res){
    console.log("in postPublicPicName");
    //if(req.file !== undefined){
    var filedata = req.file;
    var filename = {filename: filedata.filename};
    //}
    //console.log(filedata);
    res.json(filename);
};

exports.postPublicPic = function(req, res) {
    console.log("in postPublicPic");
    var data = req.query;
    var publicmsg = new publicMsg(data);
    publicmsg.save();
    var socket = connectedSocketsforPub[data.fromName];
    socket.broadcast.emit('send:publicPicture', data);
    res.sendStatus(201);
};




exports.getPublicChatMsg = function(req, res) {
//    var userName = req.query.fromName;
//    console.log('public messages history for: '+ userName);
    var info = {type: 'public', roomId: 'undefined'};
    publicMsg.getHistory(info, function(history){
        res.json(history);
    });
};