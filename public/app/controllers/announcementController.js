/**
 * Created by Ethan on 3/14/16.
 */
angular.module('myApp')
    .controller('announcementController', function ($scope, $state, $location, HomeService, AnnouncementService, User, socket) {
        $scope.announcements = [];
        $scope.location = "";
        $scope.privilege = User.getPrivilege();
        //searchInfo addin
        $scope.query= {announcement : ""};
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.numberOfPages=function() {
            return Math.ceil($scope.announcements.length / $scope.pageSize);
        };

        AnnouncementService.getAllannoucement(User.getUsername())
            .success(function (data, status, headers, config) {
                data.forEach(function(row) {
                    console.log(row);
                    $scope.announcements.unshift(row);
                });

            });

        socket.on('post:announcement', function (data) {
            console.log(data);
            $scope.announcements.unshift(data);
        });

        $scope.postAnnouncement = function() {
            //console.log("client controller post announcement");
            var data = {type: 'announce', message: $scope.announcement, fromName: User.getUsername(), timestamp: currentTime(), location: $scope.location};
            AnnouncementService.postAnnoucement(data)
                .success(function(){
                    console.log(data);
                });
            $scope.announcements.unshift(data);   // add the message to the list of local client
            $scope.announcement = '';   // clear message box
            $scope.location = '';
        };

        function currentTime() {
            var d = new Date(Date.now());
            var datestring = d.toLocaleDateString();
            var timestring = d.toLocaleTimeString();
            return datestring + " " + timestring;
        }
    });