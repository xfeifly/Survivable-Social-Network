/**
 * Created by feixu on 3/12/16.
 */
angular.module('myApp')
    .controller('chatPrivateController', function ($scope, $location, $state, $stateParams, $http, $window, HomeService, chatService, User, UserFactory, socket) {
        //$scope.partner = $stateParams;
        $scope.timestamp = currentTime();
        $scope.rooms = [];
        $scope.messagesGlobal = [];

        var formdata;
        var replyingFlag = 0;
        var dataURL;
        var currentRoom;
        UserFactory.getOne($stateParams.userName).success(function (data) {
            $scope.partner = data;
            if (data.location.gps && User.isGPS()) {
                var x = data.location.lat;
                var y = data.location.lng;
                $scope.partner.position = User.computeDistance(x, y);
            } else {
                $scope.partner.position = false;
            }
        });


        $scope.measurePosition = function () {
            $scope.instruction = 'Acquiring Current Position...';
            lobbyGetLocation(function () {
                if ($scope.partner.location.gps) {
                    var x = $scope.partner.location.lat;
                    var y = $scope.partner.location.lng;
                    $scope.partner.position = User.computeDistance(x, y);
                }
                $scope.instruction = 'Complete Acquisition';
            });
        };

        //searchInfo addin
        $scope.query = {message: ""};
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.messagesGlobal.length / $scope.pageSize);
        };
// /////////////////////////////////Sending pictures////////////////////////////////////////////////////
//
        $scope.uploadImage = function (files) {

            //fd = new FormData();
            formdata = new FormData();
            formdata.append("file", files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                dataURL = reader.result;
            };
            reader.readAsDataURL(files[0]);
            // imageFile = files[0];
        };


        $scope.uploadFile = function (room) {
            //console.log(room.roomId);
            var uploadUrl = "/pictures/private";
            $http.post(uploadUrl, formdata, {
                    transformRequest: angular.identity, headers: {'Content-Type': undefined}
                })
                .success(function (data) {
                    var messageData;
                    messageData = {
                        type: 'private',
                        message: room.message,
                        filename: data.filename,
                        roomId: room.roomId,
                        fromName: User.getUsername(),
                        timestamp: currentTime(),
                        location: room.fromLocation
                    };

                    chatService.getPrivatePic(messageData)
                        .success(function () {
                        });
                    console.log(data);
                    console.log("success!!");
                })
                .error(function () {
                    console.log("error!!");
                });

        };

        socket.on("post picture", showpicture);
        function showpicture(data) {
            console.log("receive name: " + data.filename);
            var currentRoom = $scope.rooms[0];
            // for (var id in $scope.rooms) {
            //     var room = $scope.rooms[id];
            var messageContent = {
                message: "",
                fromName: data.fromName,
                timestamp: data.timestamp,
                picture: data.filename,
                fromLocation: data.location
            };

            if (currentRoom.messages === undefined) {
                currentRoom.messages = [];
            }
            if (messageContent.fromLocation === undefined) {
                messageContent.fromLocation = User.getLocation().name;
                if(messageContent.fromLocation === ""){
                    ($window.mockWindow || $window).alert("Warning: No location!");
                }
            }

            currentRoom.messages.push(messageContent);
        }

/////////////////////////////////////////////////////////////////////////////////////////////////////
        socket.emit("private chat", {fromName: User.getUsername(), toName: $stateParams.userName});


        $scope.sendMessage = function (room) {
            var data = {
                type: 'private',
                roomId: room.roomId,
                message: room.message,
                fromName: User.getUsername(),
                timestamp: currentTime()
            };
            chatService.postPrivateMsg(data)
                .success(function () {
                });
            replyingFlag = 1;
            room.message = '';
        };

        $scope.replyTosender = function (room) {

            chatService.getPrivateMsg(room.roomId)
                .success(function (data, status, headers, config) {
                    data.forEach(function (row) {
                        var messageContent = {message: row.message, fromName: row.fromName, timestamp: row.timestamp};
                        if (row.filename) {
                            messageContent.picture = row.filename;
                        }
                        if(row.location) {
                            messageContent.fromLocation = row.location;
                        }
                        if (findRoomByID(row.roomId).messages === undefined) {
                            findRoomByID(row.roomId).messages = [];
                        }
                        findRoomByID(row.roomId).messages.push(messageContent);
                        $scope.messagesGlobal = findRoomByID(row.roomId).messages;

                    });
                });
            room.toName = $stateParams.userName;
            room.showLatest = false;
            room.showAllmsg = true;
            replyingFlag = 1;
        };


        $scope.closePrivatechat = function (room) {
            $scope.rooms.splice($scope.rooms.indexOf(room), 1);
            //socket.emit('close', room);
            replyingFlag = 0;
        };

        socket.on("initalize private chat room", function (data) {//Only available to the sender
            //TODO: When roomId already exists, do not create new room
            $scope.rooms.push({roomId: data.roomId, fromName: data.fromName, toName: data.toName});
            findRoomByID(data.roomId).showAllmsg = true;
            findRoomByID(data.roomId).showLatest = false;
            replyingFlag = 1;
            chatService.getPrivateMsg(data.roomId)
                .success(function (data, status, headers, config) {
                    data.forEach(function (row) {
                        console.log("history from server: " + row.roomId.messages);
                        if (findRoomByID(row.roomId).messages === undefined) {
                            findRoomByID(row.roomId).messages = [];
                        }
                        var messageContent = {message: row.message, fromName: row.fromName, timestamp: row.timestamp};
                        if (row.filename) {
                            messageContent.picture = row.filename;
                        }
                        if(row.location) {
                            messageContent.fromLocation = row.location;
                        }
                        console.log(messageContent);
                        findRoomByID(row.roomId).messages.push(messageContent);
                        $scope.messagesGlobal = findRoomByID(row.roomId).messages;

                    });
                });
        });
        //server will emit message to here
        socket.on("private chat message", function (data) {
            //TODO: The room might not exist for the receriver, show hint for loading the room

            console.log("In private chat message");
            if ($scope.rooms.every(function (room) {
                    return room.roomId != data.roomId;
                })) {
                $scope.rooms.push({roomId: data.roomId, toName: data.user});
                findRoomByID(data.roomId).showLatest = true;
            }
            var messageContent = {
                message: data.message,
                fromName: data.fromName,
                timestamp: data.timestamp,
                fromLocation: data.location
            };

            console.log($scope.rooms);
            var room = $scope.rooms.filter(function (room) {
                return room.roomId == data.roomId;
            })[0];

            if (room.messages === undefined) {
                room.messages = [];
            }
            if (replyingFlag == 1) {
                room.messages.push(messageContent);
                $scope.messagesGlobal = room.messages;
                // $scope.messagesGlobal.push(messageContent);
            }

            room.latestMessage = messageContent;

        });

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }

        function findRoomByID(roomId) {
            return $scope.rooms.filter(function (room) {
                return room.roomId == roomId;
            })[0];
        }

        function checkObjectContent(data) {
            var txt = "";
            var file = data;
            for (var x in file) {
                txt += "[" + x.toString() + ":" + file[x] + "], ";
            }
            return txt;
        }
        ////////////helper function for checking file content

////////////////////////////////

        socket.on('send:status', function (data) {
            if ($scope.partner.userName == data.userName) {
                $scope.partner.statusCode = data.statusCode;
                $scope.partner.updatedAt = data.updatedAt;
                $scope.partner.location = data.location;
                if (data.location.gps && User.isGPS()) {
                    var x = data.location.lat;
                    var y = data.location.lng;
                    $scope.partner.position = User.computeDistance(x, y);
                }
            }
        });

        socket.on("send:join", function (userName) {
            if ($scope.partner.userName == userName) {
                $scope.partner.isOnline = 'Online';
            }
        });

        socket.on("send:leave", function (userName) {
            if ($scope.partner.userName == userName) {
                $scope.partner.isOnline = 'Offline';
            }
        });
    });