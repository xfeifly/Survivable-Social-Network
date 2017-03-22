angular.module('PartnerService', [])
	.service('Partner', function () {
		this.setUsername = function(name) {
			this.userName = name;
		};

		this.init = function() {
			this.userName = '';
		};

		this.getUsername = function() {
			return this.userName;
		};

	});