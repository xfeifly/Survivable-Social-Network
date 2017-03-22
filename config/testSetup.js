var directory = require('../models/Directory.js');
var db = require('../config/db.js');

exports.init = function() {
    db.deleteAll();
    db.changeTestMode();
    //directory.init(function(){});
};
/*
exports.refresh = function() {
    db.changeNormalMode();
    db.changeTestMode();
    db.changeTestMode();
    directory.init();
};
*/