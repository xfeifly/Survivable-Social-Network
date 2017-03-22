/**
 * Created by feixu on 3/14/16.
 */
angular.module('chatService', []).factory('chatService',function($http){
    return{

        postPublicMsg: function(data){
          return $http({
              url: '/messages/public',
              method: 'POST',
              data: {type: data.type, message: data.message, fromName: data.fromName, timestamp: data.timestamp}
          });
        },

        postPrivateMsg: function(data){
            return $http({
                url: '/messages/private',
                method: 'POST',
                data: {type: data.type, roomId: data.roomId, message: data.message, fromName: data.fromName, timestamp: data.timestamp}
            });
        },

        getPublicMsg: function(userName){
            return $http({
                url: '/messages/public',
                method: "GET"
            });
        },
        getPublicPic:function(data){
            return $http({
                url: '/pictures/public',
                method: "GET",
                params: data
            });
        },

        getPrivateMsg: function(roomId){
            return $http({
                url: '/messages/private',
                method: 'GET',
                params: {roomId: roomId}
            });
        },
        getPrivatePic: function(data){
            return $http({
                url: '/pictures/private',
                method: 'GET',
                params: data
            });
        }

        //postPrivatePic: function(data){
        //    return $http({
        //        url: '/pictures/private',
        //        method: 'POST',
        //        headers: {'Content-Type': undefined},
        //        params: {RoomId: data.RoomId},
        //        data: data.Image
        //    //{RoomId: data.roomId, Picture: data.picture}
        //    });
        //
        //}


    }
});