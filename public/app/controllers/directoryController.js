angular.module('myApp')
    .controller('DirectoryController', function ($scope, $state, $location, User, UserFactory, socket) {
        $scope.usersTest = [];
        //$scope.users = [];
        $scope.order = ["accountStatus","-isOnline", "userName"];


        $scope.currentPage = 0;
        $scope.pageSize = 2;
        $scope.numberOfPages=function() {
            return Math.ceil($scope.users.length / $scope.pageSize);
        };

        UserFactory.getAll()
            .success(function (data, status, headers, config) {
                $scope.users = data;

            })
            .error(function (data, status, headers, config) {
                console.log(status);
            });

        socket.on("send:join", function (userName) {
            for (var i = 0; i < $scope.users.length; i++) {
                if($scope.users[i].userName == userName) {
                    $scope.users[i].isOnline = 'Online';
                    return;
                }
            }
            UserFactory.getOne(userName)
                .success(function(data) {
                    $scope.users.push(data);
                })
                .error(function(data, status, headers, config) {
                    console.log(status);
                });
        });

        socket.on("send:leave", function (userName) {
            for (var i = 0; i < $scope.users.length; i++) {
                if($scope.users[i].userName == userName) {
                    $scope.users[i].isOnline = 'Offline';
                    break;
                }
            }
        });

        socket.on('send:status', function (data) {
            for (var i = 0; i < $scope.users.length; i++) {
                if($scope.users[i].userName == data.userName) {
                    $scope.users[i].statusCode = data.statusCode;
                    $scope.users[i].updatedAt = data.updatedAt;
                    $scope.users[i].location = data.location;
                    $scope.users[i].supply.water = data.supply.water;
                    $scope.users[i].supply.food = data.supply.food;
                    $scope.users[i].accountStatus = data.accountStatus;

                    if(data.location.gps && User.isGPS()) {
                        var x = data.location.lat;
                        var y = data.location.lng;
                        $scope.users[i].position = User.computeDistance(x, y);
                    }
                    break;
                }
            }
        });

        $scope.measurePosition = function(){
            $scope.instruction = 'Acquiring Current Position...';
            lobbyGetLocation(function() {
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].location.gps) {
                        var x = $scope.users[i].location.lat;
                        var y = $scope.users[i].location.lng;
                        $scope.users[i].position = User.computeDistance(x, y);
                    }
                }
                $scope.instruction = 'Complete Acquisition';
            });
        };



    });