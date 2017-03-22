/**
 * Created by feixu on 3/15/16.
 */
var Messages = require('../models/Messages');
var expect = require('expect.js');
var assert = require('assert');
//var db = require('../config/db.js');

suite('Chat Test', function() {
    test('Set the message type', function(done){
        var data = {type: 'public', message: 'abc', timestamp:'123', fromName:'q'};
        var type = 'public';
        var message = new Messages(data);
        expect(message.istypeMatch(type)).to.be.ok;
        done();
    });

    test('Set the message content', function(done){
        var data = {type: 'public', message: 'abc', timestamp:'123', fromName:'q'};
        var msg = 'abc';
        var message = new Messages(data);
        expect(message.ismessageMatch(msg)).to.be.ok;
        done();
    });

    test('Set the roomId', function(done) {
        var data = {type: 'private', message: 'abc', timestamp:'123', fromName:'q',roomId: 1000};
        var roomId = 1000;
        var message = new Messages(data);
        expect(message.isroomIdMatch(roomId)).to.be.ok;
        done();
    });

    test('Set the timestamp', function(done) {
        var data = {type: 'public', message: 'abc', timestamp:'123', fromName:'q'};
        var timestamp = '123';
        var message = new Messages(data);
        expect(message.istimestampMatch(timestamp)).to.be.ok;
        done();
    });
    test('Set the fromName', function(done) {
        var data = {type: 'public', message: 'abc', timestamp:'123', fromName:'q'};
        var fromName = 'q';
        var message = new Messages(data);
        expect(message.isfromNameMatch(fromName)).to.be.ok;
        done();
    });


    test('Get history data for chat privately', function(done) {
        var savedata = {type:'private',message:'This is a test for getting private data', timestamp:'123', fromName:'q', roomId:1000};
        var info = {type:savedata.type, roomId:savedata.roomId};
        var message = new Messages(savedata);
        message.save();
        var verifydata = {message:savedata.message, timestamp: savedata.timestamp, fromName: savedata.fromName, roomId: savedata.roomId};
        Messages.getHistory(info,function(history){
           // console.log(history.pop());
            expect(verifydata).to.eql(history.pop());
        });
        done();
    });

    test('Get history data for public chat', function(done) {
        var savedata = {type:'public',message:'This is a test for getting public chat data', timestamp:'123', fromName:'q', fromLocation:'cmu', picture: "abcde"};
        var info = {type: savedata.type};
        var message = new Messages(savedata);
        message.save();
        var verifydata = {message:savedata.message, timestamp: savedata.timestamp, fromName: savedata.fromName, picture: "abcde", fromLocation:"cmu"};
        Messages.getHistory(info,function(history){
            // console.log(history.pop());
            expect(verifydata).to.eql(history.shift());
        });
        done();
    });

});

suite("Picture Test", function(){
    test("post public picture", function(done) {
        var data = {type: 'public', message: '1', timestamp:'123', fromName:'q', fromLocation:'cmu', picture:"qwe"};
        var picture = "qwe";
        var message = new Messages(data);
        expect(message.isPictureMatch(picture)).to.be.ok;
        done();
    });

    test("post private picture", function(done){
        var data = {type: 'private', message: '1', roomId: 1000 ,timestamp:'123', fromName:'q', fromLocation:'cmu', picture:"qwe"};
        var picture = "qwe";
        var message = new Messages(data);
        expect(message.isPictureMatch(picture)).to.be.ok;
        done();
    });

    test("get private picture roomId", function(done){
        var data = {type: 'private', message: '1', roomId: 1000 ,timestamp:'123', fromName:'q', fromLocation:'cmu', picture:"qwe"};
        var roomId = 1000;
        var message = new Messages(data);
        expect(message.isroomIdMatch(roomId)).to.be.ok;
        done();
    });

    test('Delete All Data in DB', function(done){
        var data = {type: 'private', message: '', roomId: 1000 ,timestamp:'123', fromName:'q', fromLocation:'cmu', picture:"qwe"};
        var message = new Messages(data);
        message.deletDBdata();
        done();
    });
});


suite('Announcement Test', function(){
    test('Set the location', function(done) {
        var data = {type: 'announce', message: 'This is a test for announcement', timestamp:'123', fromName:'q', location:'cmu'};
        var location = 'cmu';
        var message = new Messages(data);
        expect(message.islocationMatch(location)).to.be.ok;
        done();
    });


    test('Get history data for announcement', function(done) {
        var savedata = {type:'announce', message: 'This is a test for announcement', timestamp:'123', fromName:'q', location: 'cmu'};
        var info = {type:savedata.type};
        var message = new Messages(savedata);
        message.save();
        var verifydata = {message:savedata.message, timestamp: savedata.timestamp, fromName: savedata.fromName, location: savedata.location};
        Messages.getHistory(info,function(history){
            // console.log(history.pop());
            expect(verifydata).to.eql(history.shift());
        });
        done();
    });
});

suite('Announcement Test', function() {
    test('Set the location', function (done) {
        var data = {
            type: 'announce',
            message: 'This is a test for announcement',
            timestamp: '123',
            fromName: 'q',
            location: 'cmu'
        };
        var location = 'cmu';
        var message = new Messages(data);
        expect(message.islocationMatch(location)).to.be.ok;
        done();
    });

    test('Get history data for announcement', function (done) {
        var savedata = {
            type: 'announce',
            message: 'This is a test for announcement',
            timestamp: '123',
            fromName: 'q',
            location: 'cmu'
        };
        var info = {type: savedata.type};
        var message = new Messages(savedata);
        message.save();
        var verifydata = {
            message: savedata.message,
            timestamp: savedata.timestamp,
            fromName: savedata.fromName,
            location: savedata.location
        };
        Messages.getHistory(info, function (history) {
            // console.log(history.pop());
            expect(verifydata).to.eql(history.shift());
        });
        done();
    });
});




