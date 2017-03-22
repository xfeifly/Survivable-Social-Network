/**
 *video chat
 */
angular.module('myApp')
    .controller('videoChatController', function ($scope, $location, $state, $stateParams, HomeService, chatService, User,
                                                 UserFactory, socket){
        //$scope.partner = $stateParams;
        $scope.timestamp = currentTime();
        $scope.rooms = [];
        $scope.messagesGlobal = [];
        $scope.selfName = User.getUsername();
        $scope.countnew = 0;
        $scope.countexist = 0;
        $scope.count = 0;
        $scope.videoinfo ="" ;
        //$scope.cookie = $cookies;


        var replyingFlag = 0;
        // invoke directly
        UserFactory.getOne($stateParams.userName).success(function(data){
            $scope.partner = data;
            if(data.location.gps && User.isGPS()) {
                var x = data.location.lat;
                var y = data.location.lng;
                $scope.partner.position = User.computeDistance(x, y);
            } else {
                $scope.partner.position = false;
            }
        });

        $scope.measurePosition = function() {
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

        //emit "video chat" pass the sender name and receiver name to server side socket, to create a privatechatroom.
        socket.emit("video chat", {fromName: User.getUsername(), toName: $stateParams.userName, timestamp:currentTime()});



        $scope.closePrivatechat = function(room) {
            $scope.rooms.splice($scope.rooms.indexOf(room),1);//won't display chat room
            //socket.emit('close', room);
            replyingFlag = 0;
        };

        socket.on("initalize private chat room",function(data) {//Only available to the sender
            $scope.rooms.push({roomId: data.roomId, fromName: data.fromName, toName: data.toName});
           // console.log(data);
            findRoomByID(data.roomId).showAllmsg = true;
            findRoomByID(data.roomId).showLatest = false;

        });

        socket.on("video chat message", function (data) {
            console.log("[videochatcontroller.video chat meessage receive]");
        });

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }
        function findRoomByID(roomId){
            return $scope.rooms.filter(function(room){
                return room.roomId == roomId;
            })[0];
        }

        socket.on('send:status', function (data) {
            if($scope.partner.userName == data.userName) {
                $scope.partner.statusCode = data.statusCode;
                $scope.partner.updatedAt = data.updatedAt;
                $scope.partner.location = data.location;
                if(data.location.gps && User.isGPS()) {
                    var x = data.location.lat;
                    var y = data.location.lng;
                    $scope.partner.position = User.computeDistance(x, y);
                }
            }
        });

        socket.on("send:join", function (userName) {
            if($scope.partner.userName == userName) {
                $scope.partner.isOnline = 'Online';
            }
        });

        socket.on("send:leave", function (userName) {
            if($scope.partner.userName == userName) {
                $scope.partner.isOnline = 'Offline';
            }
        });

        function computeRoomId(fromName, toName) {
            var roomIdstring = fromName + toName;
            var roomIdnumber = 0;
            for (var i=0; i< roomIdstring.length; i++){
                roomIdnumber = roomIdnumber + roomIdstring.charCodeAt(i);
            }
            return roomIdnumber+1000;
        }

        $scope.start = function () {

            console.log("testReadiness:" + $scope.webrtc.testReadiness());
            console.log("localcontainer:" + $scope.webrtc.getLocalVideoContainer());
            console.log("remotecontainer:" + $scope.webrtc.getRemoteVideoContainer());
            console.log("remotecontainer:" + $scope.webrtc.getDomId());
            $scope.videoinfo = "testReadiness:" + $scope.webrtc.testReadiness() +
                "localcontainer:" + $scope.webrtc.getLocalVideoContainer() +
                "remotecontainer:" + $scope.webrtc.getRemoteVideoContainer() +
                "remotecontainer:" + $scope.webrtc.getDomId();

        };
        function init () {
            if (!$scope.webrtc) {
                $scope.webrtc = new SimpleWebRTC({
                    localVideoEl: 'localVideo',
                    remoteVideosEl: 'remoteVideo',
                    debug: true,
                    autoRequestMedia: true
                });
                console.log("new" + $scope.countnew ++);
            } else {
                $scope.webrtc.startLocalVideo();
                console.log("exitst:"+ $scope.countexist ++);
            }

            $scope.webrtc.on('readyToCall', function () {
                $scope.videoRoomName = computeRoomId($scope.selfName, $scope.partner.userName)+"";
                console.log($scope.selfName + " join room: " + $scope.videoRoomName);
                $scope.webrtc.joinRoom($scope.videoRoomName);
            });
            console.log( "count:" + $scope.count++);
        }
        init();

        $scope.hangUp = function () {
            $scope.webrtc.stopLocalVideo();
            //$scope.webrtc.leaveRoom();
        };
        $scope.mute = function () {
            $scope.webrtc.mute();
        };
        $scope.unmute = function () {
            $scope.webrtc.unmute();
        };
        $scope.resume = function () {
            $scope.webrtc.resume();
        };
        $scope.pause = function () {
            $scope.webrtc.pause();
        };


    });