/**
 * Created by Ethan on 4/14/16.
 */
angular.module('myApp')
    .controller('adminProfileController', function ($scope, $location, $state, $stateParams, $http, $window, HomeService, chatService, User, UserFactory, socket) {

        UserFactory.getAll()
            .success(function (data, status, headers, config) {
                $scope.users = data;
            })
            .error(function (data, status, headers, config) {
                console.log(status);
            });
    });