/**
 * Created by feixu on 3/17/16.
 */

var db = require('../config/db.js');

var Messages = function(data) {
   // console.log(data);
    if(data.type === "public"){
        this.type = data.type;
        this.message = data.message;
        this.timestamp = data.timestamp;
        this.fromName = data.fromName;
        this.roomId = "undefined";
        if(data.fromLocation){
            this.location = data.fromLocation;
        } else {
            this.location = "";
        }
        if(data.picture){
            this.filename = data.picture;
        }else {
            this.filename = "";
        }
    }

    else if(data.type === "private") {
        this.type = data.type;
        this.message = data.message;
        this.timestamp = data.timestamp;
        this.fromName = data.fromName;
        this.roomId = data.roomId;
        if(data.location){
            this.location = data.location;
        } else {
            this.location = "";
        }
        this.filename = data.filename;
    }

    else if(data.type === "announce"){
        this.type = data.type;
        this.message = data.message;
        this.timestamp = data.timestamp;
        this.fromName = data.fromName;
        this.roomId = "Undefined";
        this.location = data.location;
        this.filename = "undefined";
    }
};

Messages.prototype.save = function(){
    if(this.type === "public") {
        db.saveChatpublic(this.fromName,this.message,this.timestamp, this.filename, this.location);
    }
    else if(this.type === "private") {
        db.saveChatprivate(this.roomId, this.fromName, this.message, this.timestamp, this.filename, this.location);
    }
    else if(this.type === "announce") {
        db.saveAnnouncement(this.fromName, this.message, this.timestamp, this.location);
    }
};

Messages.getHistory = function(info, render){
    if(info.type === 'public') {
        db.getPubchatMsg(function(history){
            render(history);
        });
    }
    else if(info.type ==='private') {
        db.getPrivateChatMsg(info.roomId, function(history){
            render(history);
        });
    }

    else if(info.type === 'announce') {
        db.getAllannouncement(function(history){
            render(history);
        });
    }

};

Messages.prototype.deletDBdata = function(){
    db.deleteAll();
};

///////////For testing//////////////////////////////////
Messages.prototype.istypeMatch = function(type) {
    return this.type === type;
};

Messages.prototype.ismessageMatch = function(message) {
    return this.message === message;
};

Messages.prototype.istimestampMatch = function(timestamp) {
    return this.timestamp === timestamp;
};

Messages.prototype.isfromNameMatch = function(fromName) {
    return this.fromName === fromName;
};

Messages.prototype.isroomIdMatch = function(roomId) {
    return this.roomId === roomId;
};

Messages.prototype.islocationMatch = function(location) {
    return this.location === location;
};

Messages.prototype.isPictureMatch = function(filename){
    return this.filename === filename;
};

module.exports = Messages;