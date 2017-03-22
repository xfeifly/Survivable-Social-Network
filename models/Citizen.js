/**
 * Created by Takuma Oda on 2/20/16.
 *
 * Citizen - Citizen is a class which consists of the latest information
 * 			 about a citizen. It called by controllers to change his/her
 * 			 status and save the data in DB.
 */

var _ = require("underscore");
//var db = require('../config/db.js');
var db = require('../config/db.js');

/* Constructor - contains the following data
 * 		userName:	Specified by signup, used as a cookie
 * 		password:	Specified by signup
 * 		statusCode:	Updated by share status UC
 * 		updatedAt:	Updated by share status UC
 * 		location:	Updated by share status UC
 * 		supply:		Updated by share supply UC
 */
var Citizen = function (user) {
	this.userName = user.userName;
	this.password = user.password;
	this.isOnline = 'Offline';
	if (user.statusCode) {
		this.statusCode = user.statusCode;
		this.updatedAt = user.updatedAt;
		this.location = {
			name: user.location,
			gps: user.GPS,
			lat: user.latitude,
			lng: user.longitude
		};
		this.privilege = user.privilege;
		this.accountStatus = user.accountStatus;
		this.supply = {
			food : user.food,
			water : user.water
		};

	} else {
		this.statusCode = 'Undefined';
		this.updatedAt = '';
		this.location = {
			name: '',
			gps: 0,
			lat: 0,
			lng: 0
		};
		this.privilege = 'Citizen';
		this.accountStatus = 'Active';
		this.supply = {
			food : NaN,
			water : NaN
		};
	}
};

/* save - save its data to citizens table in DB */
Citizen.prototype.save = function(){
	db.saveUser(this);
};

/* isNameMatch - check whether a given name matches
 *				 return true/false
 */
Citizen.prototype.isNameMatch = function(name){
	return this.userName === name;
};

/* isPassMatch - check whether a given password matches
 * 				 return true/false
 */
Citizen.prototype.isPassMatch = function(pass){
	return this.password === pass;
};

/* display - return data except the password for display */
Citizen.prototype.display = function() {
	return this;
//	return _.omit(this, 'password');
};

/* updateIsOnline - update its isOnline */
Citizen.prototype.updateIsOnline = function(isOnline){
	if(isOnline)
		this.isOnline = 'Online';
	else
		this.isOnline = 'Offline';
};

/* updateStatus - update its status */
Citizen.prototype.updateStatus = function(status){
	this.statusCode = status.statusCode;
	this.updatedAt = status.updatedAt;
	this.location = status.location;
	this.supply = status.supply;
	db.updateStatus(this);
};

/* updateAccount - update its accountStatus */
Citizen.prototype.updateAccount = function(isActive){
	if(isActive)
		this.accountStatus = 'Active';
	else
		this.accountStatus = 'Inactive';
};

/* updateProfile - update its userName, password and privilege */
Citizen.prototype.changeName = function(userName){
	var oldName = this.userName;
	this.userName = userName;
	db.updateName(oldName, userName);
};

Citizen.prototype.changePassword = function(password){
	this.password = password;
	db.updatePassword(this.userName, password);
};

Citizen.prototype.changePrivilege = function(privilege){
	this.privilege = privilege;
	db.updatePrivilege(this.userName, privilege);
};

/* giveSupply - give his/her supply to public */
Citizen.prototype.giveSupply = function(food, water){
	if ((this.supply.food - Number(food)) < 0 || (this.supply.water - Number(water)) < 0){
		return false;
	} else {
		this.supply.food -= Number(food);
		this.supply.water -= Number(water);
		Citizen.publicFood += Number(food);
		Citizen.publicWater += Number(water);
		db.updateSupply(this.userName, this.supply.food, this.supply.water);
		db.publicSupply(Citizen.publicFood, Citizen.publicWater);
		return true;
	}
};

/* getSupply - get public supply */
Citizen.prototype.getSupply = function(food, water){
	if ((Citizen.publicFood - Number(food)) < 0 || (Citizen.publicWater - Number(water)) < 0) {
		return false;
	} else {
		this.supply.food += Number(food);
		this.supply.water += Number(water);
		Citizen.publicFood -= Number(food);
		Citizen.publicWater -= Number(water);
		db.updateSupply(this.userName, this.supply.food, this.supply.water);
		db.publicSupply(Citizen.publicFood, Citizen.publicWater);
		return true;
	}
};

/* publicSupply - return public supply */
Citizen.publicSupply = function(){
	return {food : Citizen.publicFood, water : Citizen.publicWater}
};

Citizen.updatePublicSupply = function(food, water){
	Citizen.publicFood = food;
	Citizen.publicWater = water;
};

Citizen.prototype.updateSupply = function(food, water){
	this.supply.food = Number(food);
	this.supply.water = Number(water);
	db.updateSupply(this.userName, this.supply.food, this.supply.water);
};

Citizen.publicFood = -1;
Citizen.publicWater = -1;

db.getSupply(function(row){
	Citizen.publicFood = row.food;
	Citizen.publicWater = row.water;
}, function(){
	if(Citizen.publicFood < 0){
		db.initSupply();
		db.getSupply(function(row) {
			Citizen.publicFood = row.food;
			Citizen.publicWater = row.water;
		}, function(){});
	}
});

module.exports = Citizen;