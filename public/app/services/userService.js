angular.module('UserService', [])
	.service('User', function () {
		this.latestGps = false;
		this.latestLat = 0;
		this.latestLng = 0;

		this.setUsername = function(name) {
			this.userName = name;
		};

		this.setIsNew = function(isNew) {
			this.isNew = isNew;
		};

		this.getIsNew = function() {
			return this.isNew;
		};

		this.init = function(data){
			this.userName = data.userName;
			this.statusCode = data.statusCode;
			this.updatedAt = data.updatedAt;
			this.location = data.location;
			this.privilege = data.privilege;
			this.accountStatus = data.accountStatus;
			this.water = data.supply.water;
			this.food = data.supply.food;
		};

		/*
		this.initStatus = function(){
			this.statusCode = 'Undefined';
			this.updatedAt = '';
			this.location = {name:'', gps:0, lat:0, lng:0};
			this.isNew = true;
		};
		*/
		this.getPrivilege = function () {
			return this.privilege;
		};

		this.getAccountStatus = function () {
			return this.accountStatus;
		};

		this.setGPS = function(gps, lat, lng) {
			this.latestGps = gps;
			this.latestLat = lat;
			this.latestLng = lng;
		};

		this.isGPS = function() {
			return this.latestGps;
		};
		this.getLat = function() {
			return this.latestLat;
		};
		this.getLng = function() {
			return this.latestLng;
		};

		this.computeDistance = function(x, y) {
			var dx = (x - this.latestLat) * 40076500 * Math.cos((this.latestLng) * Math.PI / 180) / 360;
			var dy = (this.latestLng - y) * 40008600 / 360;
			var directions = ['W', 'SW', 'S', 'SE', 'E', 'NE', 'N', 'NW'];
			console.log([dx, dy]);
			var r = Math.sqrt(dx*dx + dy*dy);
			var d = Math.floor((Math.atan2(dy, dx)*180/Math.PI+180+22.5)/45)%8;
			//console.log(d);
			return {distance: r, direction: directions[d]};
		};

		this.setStatusCode = function(statusCode) {
			this.statusCode = statusCode;
		};

		this.setUpdatedAt = function(updatedAt) {
			this.updatedAt = updatedAt;
		};

		this.setLocation = function(location) {
			this.location = location;
		};


		this.setSupply = function(supply){
			this.water = supply.water;
			this.food = supply.food;
		};

		this.getUsername = function() {
			return this.userName;
		};

		this.getStatusCode = function() {
			return this.statusCode;
		};

		this.getUpdatedAt = function() {
			return this.updatedAt;
		};

		this.getLocation = function() {
			return this.location;
		};

		this.getWater = function() {
			return this.water;
		};

		this.getFood = function() {
			return this.food;
		};
	})
	.factory('UserFactory', function($http) {
		return {
			getAll: function () {
				return $http.get('/users');
			},

			getOne: function (userName) {
				return $http.get('/users/' + userName);
			},

			activateOne: function (userName) {
				return $http({
					url: '/users/' + userName + '/active',
					method: 'PUT'
				})
			},

			inactivateOne: function (userName) {
				return $http({
					url: '/users/' + userName + '/inactive',
					method: 'PUT'
				})
			},
			//question import new username in the json file and user use the
			updateProfile: function (data1) {
				return $http({
					url: '/users/' + data1.userNameOld,
					method: 'PUT',
					data: {
						userName : data1.userNameOld,
						newName: data1.userNameNew,
						password : data1.password,
						newPassword: data1.newPassword,
						privilege : data1.privilege,
						newPrivilege : data1.newPrivilege
					}
				})
			},

			shareStatus: function (userName, statusCode, updatedAt, location, supply) {
				return $http({
					url: '/users/' + userName + '/status',
					method: "POST",
					data: {
						statusCode: statusCode,
						updatedAt: updatedAt,
						location: location,
						supply: supply
					}
				});
			}
		}
	});