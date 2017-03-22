//var db = require('../config/db.js');
var chatPublicly = require('../controllers/chatPublicly.js');
var Measurement = require('../models/Measurement.js');
var measurement = new Measurement();
var directory = require('../models/Directory.js');

exports.checkMode = function(req, res, next) {
    if (measurement.mode) {
        next();
    } else {
        res.sendStatus(404);
    }
};

exports.test = function(req, res, next) {
    measurement.testMode();
};

exports.initialize = function(req, res) {
    //console.log(req.query);
    measurement.testMode();
    directory.init(function(){});
    //measurement.interval = req.query.interval;
    //measurement.duration = req.query.duration;
    res.sendStatus(200);
    console.log('Initialize Performance Measurement');
};

exports.postStart = function(req, res) {
    measurement.init();
    measurement.start();
    res.sendStatus(200);
    console.log('Start POST Measurement');
};

exports.post = function(req, res) {
    measurement.count++;
    if(measurement.count > 1000){
        res.send('over');
        measurement.normalMode();
        directory.init(function(){});
        console.log('End by overflow');
    } else {
        chatPublicly.postPublicMsg(req, res);
    }
};

exports.postEnd = function(req, res) {
    console.log(measurement.count);
    measurement.end();
    res.json(measurement.computePerformance());
    console.log('End POST Measurement');
    console.log(measurement.computePerformance());
};

exports.getStart = function(req, res) {
    measurement.init();
    measurement.start();
    res.sendStatus(200);
    console.log('Start GET Measurement');
};

exports.get = function(req, res) {
    measurement.count++;
    chatPublicly.getPublicChatMsg(req, res);
};

exports.getEnd = function(req, res) {
    measurement.end();
    res.json(measurement.computePerformance());
    measurement.normalMode();
    directory.init(function(){});
    console.log('End GET Measurement');
    console.log(measurement.computePerformance());
};