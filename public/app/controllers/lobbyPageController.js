angular.module('myApp')
	.controller('LobbyPageController', function ($scope, $state, $location, $window, HomeService, Partner, User, socket) {

		/* Initialization */
		$scope.userName = User.getUsername();
		$scope.statusCode = User.getStatusCode();
		$scope.updatedAt = User.getUpdatedAt();
		$scope.location = User.getLocation();
		$scope.water = User.getWater();
		$scope.food = User.getFood();
		$scope.unread = false;
		$scope.latest = [];
		$scope.videoRequest = [];
		$scope.latestPublic = [];
		$scope.accountStatus = User.getAccountStatus();
		$scope.privilege = User.getPrivilege();

		if (User.getIsNew()) {
			$state.go('lobby.welcome');
		}
		socket.emit('enter lobby', User.getUsername()); //tell the server to connect the client's socket
		Partner.init();

		$scope.goDirectory = function(){
			Partner.init();
			$state.go('lobby.directory');
		};
		$scope.goMessages = function(){
			$scope.latestPublic = [];
			Partner.init();
			$state.go('lobby.messages');
		};
		$scope.goShareStatus = function(){
			Partner.init();
			$state.go('lobby.shareStatus');
		};
		$scope.goAnnouncement = function(){
			Partner.init();
			$state.go('lobby.announcement');
		};
		$scope.goMeasurement = function(){
			Partner.init();
			$state.go('lobby.measurement');
		};
		$scope.logout = function(){
			HomeService.logout(User.getUsername())
				.success(function() {
					$location.path('/index');
				});
		};
		$scope.goPrivateChat = function(userName){
			for(var i = $scope.latest.length-1; i >= 0; i--) {
				if ($scope.latest[i].userName == userName) {
					$scope.latest.splice(i,1);
				}
			}
			Partner.setUsername(userName);
			$state.go('lobby.privateChat', {userName : userName});
		};


		$scope.goVideoChat = function(userName){
			for(var i = $scope.latest.length-1; i >= 0; i--) {
				if ($scope.latest[i].userName == userName) {
					$scope.latest.splice(i,1);
				}
			}
			Partner.setUsername(userName);
			$state.go('lobby.videoChat', {userName : userName});
		};
        //need modifi
		$scope.goAdminProfile = function(){
			Partner.init();
			$state.go('lobby.adminProfile');
		};

		$scope.goEditUserProfile = function(userName){
			Partner.init();
			for(var i = $scope.latest.length-1; i >= 0; i--) {
				if ($scope.latest[i].userName == userName) {
					$scope.latest.splice(i,1);
				}
			}
			$state.go('lobby.editProfile',{userName : userName});
		};


		$scope.goPrivateSupply = function(userName){
			$state.go('lobby.privateSupply', {userName : userName});
		};

		$scope.goPublicWarehouse = function(userName){
			$state.go('lobby.publicWarehouse', {userName: userName});
		};


		/* Global Function */
		updateStatus = function(){
			$scope.statusCode = User.getStatusCode();
			$scope.updatedAt = User.getUpdatedAt();
			$scope.location = User.getLocation();
			$scope.water = User.getWater();
			$scope.food = User.getFood();
		};

		lobbyGetLocation = function(cb) {
			if($window.navigator.geolocation) {
				$window.navigator.geolocation.getCurrentPosition(
					function( position ) {
						var data = position.coords;
						var lat = data.latitude;
						var lng = data.longitude;
						console.log( "[" + lat + "," + lng + "]" );
						User.setGPS(true, lat, lng);
						$scope.$apply(function(){
							cb(lat,lng);
						});
					},

					function( error ){
						var errorInfo = [
							"Unknown Error" ,
							"Permission Denied" ,
							"Position Unavailable" ,
							"Timeout"];
						alert(errorInfo[error.code]);
					},
					{
						"enableHighAccuracy": false,
						"timeout": 8000,
						"maximumAge": 2000
					}

				) ;
			}
			else
			{
				var errorMessage = "Geolocation is not supported by this browser." ;
				alert( errorMessage );
			}
		};

		/* Event Handler */
		socket.on("private chat message", function (data) {
			if(data.fromName != User.getUsername() && data.fromName != Partner.getUsername()){
				var info = {
					type : 'sends message',
					userName : data.fromName,
					timestamp : data.timestamp
				};
				$scope.latest.push(info);
			}
		});

		socket.on("video chat message", function (data) {
			console.log("[lobby page controller: video chat message]");
			if(data.fromName != User.getUsername() && data.fromName != Partner.getUsername()) {
				var info = {
					type: 'video chat request', userName: data.fromName, timestamp: data.timestamp
				};
				$scope.videoRequest.push(info);
			}

		});

		socket.on("send:publicPicture", function (data) {
			if(data.fromName != User.getUsername() && data.fromName != Partner.getUsername()){
				var info = {
					type : 'sends public picture',
					userName : data.fromName,
					timestamp : data.timestamp
				};
				$scope.latestPublic.push(info);
			}
		});

		socket.on("post picture", function(data){
			if(data.fromName != User.getUsername() && data.fromName != Partner.getUsername()){
				var info = {
					type : 'sends picture',
					userName : data.fromName,
					timestamp : data.timestamp
				};
				$scope.latest.push(info);
			}
		});


		socket.on("send:status", function (data) {
			if(data.userName != User.getUsername() && data.userName != Partner.getUsername()){
				var info = {};
				if(data.isSupply==true){
				 	info = {
						type: data.supplyInfo,
						userName:data.userName,
						timestamp : data.timestamp
					}
				} else {
				 	info = {
						type : 'updates status',
						userName : data.userName,
						timestamp : data.updatedAt
					};
				}

				$scope.latest.push(info);
			}
		});

		socket.on('send:inactive', function (data) {
			console.log("data:" + data);
			console.log("data:" + data.name);
			console.log("enter logout");
			if(User.getUsername() == data) {
			$window.alert('you have been inactivated!');
				HomeService.logout(User.getUsername())
					.success(function() {
						$location.path('/index');
					});
			}


		});

		socket.on('updateProfile', function (data) {
			console.log("data:" + data);
			//console.log("data:" + data.name);
			console.log("enter logout");

			//userName : data.userNameOld,
			//	newName: data.userNameNew,
			//	password : data.password,
			//	newPassword: data.newPassword,
			//	privilege : data.privilege,
			//	newPrivilege : data.newPrivilege

			if(User.getUsername() == data.userName) {
				var message = "Your profile info has been changed:\n";
				if(data.newName != "NotSet") {
					message += "Your userName has been changed from " + data.userName +"  to " + data.newName +"\n";
					User.setUsername(data.newName);
				}
				if (data.newPassword != "NotSet") {
					message += "Your password has been changed from " + data.password + " to" + data.newPassword + "\n";
				}
				if (data.newPrivilege != "NotSet") {
					message += "Your privilege has been changed from " + data.privilege + " to" + data.newPrivilege + "\n";
				}
				$window.alert(message + "Please login with your new info!");
				HomeService.logout(User.getUsername())
					.success(function() {
						$location.path('/index');
					});
			}


		});


	});