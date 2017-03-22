/*
 * Created by Takuma Oda on 3/20/16.
 *
 * Measurement -
 */
var db = require('../config/db.js');

/* Constructor -  */
var Measurement = function () {
	this.startTime = 0;
	this.endTime = 0;
	this.count = 0;
	this.duration = 0;
	this.mode = true;
};

Measurement.prototype.init = function () {
	this.startTime = 0;
	this.endTime = 0;
	this.count = 0;
	this.duration = 0;
};

Measurement.prototype.start = function(){
	this.startTime = Date.now();
};

Measurement.prototype.end = function(){
	this.endTime = Date.now();
	this.duration = (this.endTime - this.startTime)/1000;
};


Measurement.prototype.normalMode = function(){
	if(db.mode){
		db.dropAll();
	}
	this.mode = true;
	db.changeNormalMode();
};

Measurement.prototype.testMode = function(){
	this.mode = false;
	db.changeTestMode();
};

Measurement.prototype.computePerformance = function(){
	return {
		performance : this.count / this.duration,
		duration : this.duration
	};
};

module.exports = Measurement;