angular.module('HomeService', []).factory('HomeService', function($http) {
	return {
		login: function(userName, password) {
			return $http({
				url: '/login',
				method: "GET",
				params: {userName: userName, password: password}
			});
		},
		signup: function(userName, password) {
			return $http({
				url: '/users/' + userName,
				method: "POST",
				data: {userName: userName, password: password}
			});
		},
		logout: function(userName) {
			return $http({
				url: '/logout',
				method: "GET",
				params: {userName: userName}
			});
		}
	}
});