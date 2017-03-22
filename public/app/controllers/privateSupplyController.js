/**
 * Created by feixu on 4/16/16.
 */
angular.module('myApp')
    .controller('privateSupplyController', function ($scope, $state, $window, supplyService, User, socket) {
        $scope.privateWater = User.getWater();
        $scope.privateFood = User.getFood();


        $scope.shareSupply = function() {
            var shareWater = $scope.sharewater;
            var shareFood = $scope.sharefood;
            if(($scope.privateWater-shareWater)>=5 && ($scope.privateFood-shareFood)>=5){

                $scope.privateWater = $scope.privateWater - shareWater;
                $scope.privateFood = $scope.privateFood - shareFood;

                $scope.sharewater = '';
                $scope.sharefood ='';

                supplyService.shareSupply(User.getUsername(),shareWater,shareFood, currentTime())
                    .success(function(data, status, headers, config){
                    });

                var myCurrentSupply = {
                    water: $scope.privateWater,
                    food:$scope.privateFood
                };
                User.setSupply(myCurrentSupply);
                updateStatus();

            } else if(($scope.privateWater-shareWater)<5){
                $scope.sharewater = '';
                $scope.sharefood = '';
                ($window.mockWindow || $window).alert("Warning! You cannot share anymore: Water is less than 5 after sharing!");
            } else if(($scope.privateFood-shareFood)<5){
                $scope.sharewater = '';
                $scope.sharefood = '';
                ($window.mockWindow || $window).alert("Warning! You cannot share anymore: Food is less than 5 after sharing!");
            }

        };

        socket.on('send:status', function (data) {

        });

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }
    });