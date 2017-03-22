/**
 * Created by feixu on 4/15/16.
 */
angular.module('supplyService',[]).factory('supplyService',function($http){
    return{
        updateSupply: function(userName, water, food){
            return $http({
                url:'/supply/update',
                method:'POST',
                data:{userName: userName, food: food, water: water}
            });
        },
        shareSupply: function(userName, water, food, timestamp){
            return $http({
                url:'/supply/give',
                method:'POST',
                data:{userName: userName, water: water, food: food, timestamp: timestamp}
            });
        },

        publicSupply: function(){
            return $http({
                url:'/supply',
                method:'GET'
            })
        },
        getPublicSupply: function(userName, water, food, timestamp){
            return $http({
                url:'/supply/get',
                method:'POST',
                data:{userName: userName, water: water, food: food, timestamp: timestamp}
            })
        }
    }
});