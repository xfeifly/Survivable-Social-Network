/**
 * Created by Ethan on 3/14/16.
 */
angular.module('AnnouncementService', []).factory('AnnouncementService', function ($http) {
    return {

        getAllannoucement: function (userName) {
            return $http({
                url: '/messages/announcements',
                method: "GET",
                params: {fromName: userName}
            });
        },
        postAnnoucement: function (data) {
            return $http({
                url: '/messages/announcements',
                method: "POST",
                data: {
                    type: data.type,
                    fromName: data.fromName,
                    message: data.message,
                    timestamp: data.timestamp,
                    location: data.location
                }
            });
        }
    }
});