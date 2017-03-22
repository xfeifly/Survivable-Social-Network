var directory = require('../models/Directory.js');
var Citizen = require('../models/Citizen.js');
var socketsForSupply = {};//a map of username and socket
var ioForSupply = {};

exports.updateSocket = function (connectedUsers, io) {
    socketsForSupply = connectedUsers;
    ioForSupply = io;
};

exports.publicSupply = function(req, res) {
    res.json(Citizen.publicSupply());
};

exports.updateSupply = function(req, res) {
    var name = req.body.userName;
    var food = req.body.food;
    var water = req.body.water;
    console.log("updateSupply");
    console.log(name);
    console.log(food);
    console.log(water);
    directory.findName(name, function(user){
        if(!user){
            res.sendStatus(404);
        } else {
            user.updateSupply(food, water);
            res.sendStatus(201);
        }
    });
};

exports.giveSupply = function(req, res) {
    var name = req.body.userName;
    var food = req.body.food;
    var water = req.body.water;
    directory.findName(name, function(user){
        if(!user){
            res.sendStatus(404);
        } else {
            if(user.giveSupply(food, water))
                res.sendStatus(201);
            else
                res.sendStatus(200);
        }
    });
    /* should be discussed */
    var status = req.body;
    status.isSupply = true;
    status.supplyInfo = "share supply: " + "Food: "+ food + " " + "Water: " + water + ": ";
    var socket = socketsForSupply[name];
    socket.broadcast.emit('send:status', status);
};

exports.getSupply = function(req, res) {
    var name = req.body.userName;
    var food = req.body.food;
    var water = req.body.water;
    directory.findName(name, function(user){
        if(!user){
            res.sendStatus(404);
        } else {
            if(user.getSupply(food, water))
                res.sendStatus(201);
            else
                res.sendStatus(200);
        }
    });
    var status = req.body;
    status.isSupply = true;
    status.supplyInfo = "get supply: " + "Food: "+ food + " " + "Water: " + water + ": ";
    var socket = socketsForSupply[name];
    socket.broadcast.emit('send:status', status);
};