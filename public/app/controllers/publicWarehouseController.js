angular.module('myApp')
    .controller('publicWarehouseController', function ($scope, $state,$window, supplyService, User, socket) {

        $scope.publicWater = '';
        $scope.publicFood = '';

        //get current public warehouse supply
        supplyService.publicSupply()
            .success(function(data, status, headers, config){
                $scope.publicWater = data.water;
                $scope.publicFood = data.food;
            });

        //get supply from public warehouse
        $scope.getSupply = function() {
            if(User.getWater()<=10 && User.getFood()<=10){//condition1:  personal food or water is less than 10 units
                if($scope.publicWater-$scope.getwater>0 && $scope.publicFood-$scope.getfood>0){//condition2: public warehouse can provide the supply requested
                    if($scope.getwater <= 10 && $scope.getfood <= 10){ //condition3: cannot get more than 5 at one time
                        supplyService.getPublicSupply(User.getUsername(), $scope.getwater, $scope.getfood, currentTime())
                            .success(function(data, status, headers, config){

                                supplyService.publicSupply()
                                    .success(function(data, status, headers, config){
                                        $scope.publicWater = data.water;
                                        $scope.publicFood = data.food;
                                    });

                                var myCurrentSupply = {
                                    water: User.getWater() + $scope.getwater,
                                    food: User.getFood() + $scope.getfood
                                };
                                supplyService.updateSupply(User.getUsername(),myCurrentSupply.water,myCurrentSupply.food)
                                    .success(function(){
                                    });
                                User.setSupply(myCurrentSupply);
                                updateStatus();

                                $scope.getwater = "";
                                $scope.getfood = "";
                            });
                    }else if($scope.getwater > 10){
                        ($window.mockWindow || $window).alert("Warning! You cannot get more than 10 units of water at one time!");
                    }else if($scope.getfood > 10){
                        ($window.mockWindow || $window).alert("Warning! You cannot get more than 10 units of food at one time!");
                    }
                }
            }else if(User.getWater()>10){
                ($window.mockWindow || $window).alert("Warning! You cannot get anymore: your water is more than 10 now!");
            }else if(User.getFood()>10){
                ($window.mockWindow || $window).alert("Warning! You cannot get anymore: your food is more than 10 now!");
            }
        };

        socket.on('send:status', function (data) {
            if(data.isSupply == true){
                supplyService.publicSupply()
                    .success(function(data, status, headers, config){
                        $scope.publicWater = data.water;
                        $scope.publicFood = data.food;
                    });
            }
        });

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }
    });