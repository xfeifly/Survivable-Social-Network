angular.module('myApp')
    .controller('chatController', function ($scope, $state, $location, $http, $window, HomeService, User, chatService, socket) {

        var formdatapublic;
        var dataURL;
        var files;
        $scope.messages = [];
        //searchInfo addin
        $scope.query = {message: ""};
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.messages.length / $scope.pageSize);
        };

        ///////////////////////////////////////////////////////////////////
        $scope.uploadImage = function (files) {

            //fd = new FormData();

            formdatapublic = new FormData();
            formdatapublic.append("pubicfile", files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                dataURL = reader.result;
            };
            reader.readAsDataURL(files[0]);
            // imageFile = files[0];
        };
/////////////////////////////////////////////////////////////////////
        $scope.uploadFile = function () {
            var uploadUrl = "/pictures/public";
            $http.post(uploadUrl, formdatapublic, {
                    transformRequest: angular.identity, headers: {'Content-Type': undefined}
                })
                .success(function (data) {
                    var messageData;
                    messageData = {
                        type: 'public',
                        message: $scope.message,
                        picture: data.filename,
                        fromName: User.getUsername(),
                        timestamp: currentTime(),
                        fromLocation: $scope.fromLocation
                    };

                    if($scope.fromLocation === undefined){
                        $scope.fromLocation = User.getLocation().name;
                        if($scope.fromLocation === ""){
                            ($window.mockWindow || $window).alert("Warning: No location!");
                        }
                    }
                    console.log(data.filename);
                    if (messageData.message === undefined) {
                        messageData.message = "";
                    }
                    if (messageData.fromLocation === undefined) {
                        messageData.fromLocation = "";
                    }
                    if (messageData.picture === undefined) {
                        messageData.picture = "";
                    }
                    $scope.messages.push(messageData);
                    chatService.getPublicPic(messageData)
                        .success(function () {
                        });
                    console.log(data);
                    console.log("success!!");

                })
                .error(function () {
                    console.log("error!!");
                });
        };
        //////////////////////////////////////////////////////////
        socket.on("send:publicPicture", function (data) {
            //console.log("receive name: " + data.filename);
            // for (var id in $scope.rooms) {
            //     var room = $scope.rooms[id];
            var messageContent = {
                message: "",
                fromName: data.fromName,
                timestamp: data.timestamp,
                picture: data.picture,
                fromLocation: data.fromLocation
            };
            console.log(data.fromLocation);
            console.log(User.getLocation().name);
            if(User.getLocation().name == data.fromLocation){
                $scope.messages.push(messageContent);
            }
        socket.emit('enter lobby', User.getUsername());

        });
//////////////////////////////////////////////

        //ask server for the public char message and pictures history
        chatService.getPublicMsg(User.getUsername())
            .success(function (data, status, headers, config) {
                data.forEach(function (row) {
                    if ($scope.messages === undefined) {
                        $scope.messages.messages = [];
                    }
                    var messageContent = {
                        message: row.message,
                        fromName: row.fromName,
                        timestamp: row.timestamp,
                        picture: row.picture,
                        fromLocation: row.fromLocation
                    };
                    $scope.messages.push(messageContent);
                });
            });

        $scope.sendMessage = function () {
            var data = {
                type: 'public',
                message: $scope.message,
                fromName: User.getUsername(),
                timestamp: currentTime()
            };
            chatService.postPublicMsg(data)
                .success(function () {
                    console.log(data);
                });
            $scope.messages.push(data);   // add the message to the list of local client
            $scope.message = '';   // clear message box
        };

        socket.on('send:message', function (data) {
            console.log(data);

            $scope.messages.push(data);
        });


        socket.on('user:join', function (data) {
            if (data.list) {
                $scope.users = data.list;
            }
            if (data.new_one) {
                $scope.local_user = data.new_one;
            }
        });

        socket.on('user:exit', function (data) {
            $scope.users = data.list;
        });

        function messageToDisplay(data) {
            var message = "";
            message = data.user + " : ";
            message += data.message;
            message = message + ":  " + data.timestamp;
            return message;
        }

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }
    });