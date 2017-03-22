angular.module('myApp')
    .controller('shareStatusController', function ($scope, $state, $location, $window, User, UserFactory, supplyService) {
        $scope.gps = User.isGPS();
        $scope.lat = User.getLat();
        $scope.lng = User.getLng();
        $scope.instruction = '';

        $scope.shareStatus = function(){
            var date = new Date();
            var updatedAt = date.toLocaleString();
            var statusCode = $scope.selectedStatusCode;
            var supply = {
                water: $scope.waterSupply,
                food: $scope.foodSupply
            };

            var location = {
                name: $scope.selectedLocation,
                gps: $scope.gps,
                lat: $scope.lat,
                lng: $scope.lng
            };
            UserFactory.shareStatus(User.getUsername(), statusCode, updatedAt, location, supply)
                .success(function(data, status, headers, config) {
                    User.setStatusCode(statusCode);
                    User.setUpdatedAt(updatedAt);
                    User.setLocation(location);
                    User.setSupply(supply);
                    updateStatus();
                });

            supplyService.updateSupply(User.getUsername(),$scope.waterSupply,$scope.foodSupply)
                .success(function(data, status, headers, config){
                });
        };

        $scope.getPosition = function(){
            $scope.instruction = 'Acquiring Current Position...';
            lobbyGetLocation(function(lat, lng) {
                $scope.gps = true;
                $scope.lat = lat;
                $scope.lng = lng;
                $scope.instruction = 'Complete Acquisition';
            });
        };

    });