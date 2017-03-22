angular.module('myApp')
	.controller('HomePageController', function ($scope, $state, $location, HomeService, User) {
		$scope.instruction = '';
		$scope.signupButton = false;
		$scope.userName = '';
		$scope.password = '';

		$scope.login = function() {
			if (checkCharLong()) {
				HomeService.login($scope.userName, $scope.password)
					.success(function (data, status, headers, config) {
						if (data.userName && data.userName == $scope.userName) {
							//User.setUsername(data.userName);
							//User.setStatusCode(data.statusCode);
							//User.setUpdatedAt(data.updatedAt);
							//User.setLocation(data.location);
							User.init(data);
							User.setIsNew(false);
							$location.path('/lobby');

						} else {
							showInstruction(data);
						}
					});
			}
		};

		$scope.signup = function() {
			if (checkCharLong()) {
				HomeService.signup($scope.userName, $scope.password)
					.success(function (data, status, headers, config) {
						if (status == 201){
							User.init(data);
							User.setIsNew(true);
							//User.setUsername($scope.userName);
							//User.initStatus();
							$location.path('/lobby');

						} else {
							showInstruction(data.userName);
						}
					});
			}
		};

		checkCharLong = function(){
			if ($scope.userName.length < 3){
				$scope.instruction = 'The user name needs to be more than 3 characters';
				return false;
			} else if ($scope.password.length < 4) {
				$scope.instruction = 'The password needs to be more than 4 characters';
				return false;
			}
			return true;
		};

		showInstruction = function(res){
			if (res == 'unused'){
				$scope.instruction = 'Please push the signup button if you want to create a new account';
				$scope.signupButton = true;
			} else if (res == 'wrong'){
				$scope.instruction = 'The password is incorrect';
			} else if (res == 'reserved'){
				$scope.instruction = 'The user name is not allowed';
			} else if (res == 'used'){
				$scope.instruction = 'The user name has been already used';
			} else if (res == 'inactive'){
				$scope.instruction = 'The account status is inactive';
			}
		};
	});