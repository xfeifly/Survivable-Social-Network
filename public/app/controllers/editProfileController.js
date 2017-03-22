/**
 * Created by Ethan on 4/14/16.
 */
angular.module('myApp')
    .controller('editProfileController', function ($scope, $location, $state, $stateParams, $http, $window, HomeService, chatService, User, UserFactory, socket) {
        UserFactory.getOne($stateParams.userName).success(function (data) {
            console.log(data);
            $scope.user = data;
            $scope.userName = data.userName;//store the username that can be used to update the database
            $scope.userNameOld = data.userName;//store the username that can be used to query and update the database
            $scope.privilege = data.privilege;
            $scope.privilegeOld = data.privilege;
            $scope.accountStatus = data.accountStatus;
            $scope.password = data.password;
            $scope.passwordOld = data.password;
            $scope.returnInfo = "Welcome to update personal profile";
        });
        $scope.userNameEnable = 0;
        $scope.userPwdEnable = 0;


        $scope.privilegeOptions = {
            availableOptions: [
                {'id': "1","name":"Administrator"},
                {'id': "2","name":"Monitor"},
                {'id':"3","name":"Coordinator"},
                {'id':"4","name":"Citizen"}
            ],
            selectedOption: {'id':"5","name":"default value" } //This sets the default value of the select in the ui
        };
        $scope.accountStatusOptions = {
            availableOptions: [
                {'id': "1","name":"Active"},
                {'id': "2","name":"Inactive"}
            ],
            selectedOption: {'id':"3","name":"default value" } //This sets the default value of the select in the ui
        };

        $scope.updateProfile = function () {
            //check the character long
            $scope.instruction = "";
            if (checkCharLong()) {
                //if changed, update the change
                if( $scope.privilegeOptions.selectedOption.name != "default value") {
                    $scope.privilege = $scope.privilegeOptions.selectedOption.name;
                }
                console.log("updateProfile");

                var changeFlag = 0;
                var data1 = {"userNameOld":$scope.userNameOld,"userNameNew":"NotSet","password":$scope.passwordOld,
                    "newPassword":"NotSet","privilege":$scope.privilegeOld,"newPrivilege":"NotSet"};
                //judge the userName change
                if($scope.userNameOld != $scope.userName) {
                    data1.userNameNew =  $scope.userName;
                    changeFlag = 1;
                }
                //judge the privilege change
                if ($scope.privilegeOld != $scope.privilege && $scope.privilegeOptions.selectedOption.name != "default value" ) {
                    data1.newPrivilege = $scope.privilege;
                    changeFlag = 1;
                }
                //judge the password change
                if ($scope.passwordOld != $scope.password) {
                    data1.newPassword = $scope.password;
                    changeFlag = 1;
                }
                //if changed
                if (changeFlag == 1) {
                    //call restAPI
                    UserFactory.updateProfile(data1)
                        .success(function (data, status, headers, config) {
                            $scope.returnInfo = data;
                            console.log($scope.returnInfo + " " + "status:" +status);
                            showInstruction(data);
                            changeFlag = 0;
                            $window.alert('You made some change(s) to the user, please check the instruction below the button!')
                        })
                        .error(function (data, status, headers, config) {
                            $scope.returnInfo = data;
                            console.log($scope.returnInfo + " status:" +status);
                            showInstruction(data);
                            console.log("failed to update profile");
                            changeFlag = 0;
                            $window.alert('failed to update profile!')
                        });

                } else {//if not changed
                    $window.alert("You haven't made change to this usr, please try again!");
                }
            }


        };

        $scope.updateAccountStatus = function () {
            if( $scope.accountStatusOptions.selectedOption.name == "Active" && $scope.accountStatus == "Inactive") {
                $scope.accountStatus = $scope.accountStatusOptions.selectedOption.name;
                //call api to Inactivate user
                UserFactory.activateOne($scope.userNameOld)
                    .success(function (data, status, headers, config) {
                        $scope.returnInfo = data;
                        console.log($scope.returnInfo + " " + "status:" +status);
                        console.log("activate account status successfuly");
                        $window.alert('activate account status successfuly');
                    })
                    .error(function (data, status, headers, config) {
                        $scope.returnInfo = data;
                        console.log($scope.returnInfo + " status:" +status);
                        console.log("failed to activate account status");
                        $window.alert('failed to activate account status');
                    });

            } else if ($scope.accountStatusOptions.selectedOption.name == "Inactive" && $scope.accountStatus == "Active") {

                $scope.accountStatus = $scope.accountStatusOptions.selectedOption.name;
                //call api to Activate user
                UserFactory.inactivateOne($scope.userNameOld)
                    .success(function (data, status, headers, config) {
                        $scope.returnInfo = data;
                        console.log($scope.returnInfo + " " + "status:" +status);
                        console.log("inactivate account status successfuly");
                        $window.alert('inactivate account status successfuly');
                    })
                    .error(function (data, status, headers, config) {
                        $scope.returnInfo = data;
                        console.log($scope.returnInfo + " status:" +status);
                        console.log("failed to inactivate account status");
                        $window.alert('failed to inactivate account status');
                    });
            } else {
                $window.alert('Please make change to the account status!');
            }
        };

        checkCharLong = function(){
            if ($scope.userName.length < 3){
                $scope.instruction = 'The user name needs to be more than 3 characters';
                return false;
            } else if ($scope.password.length < 4) {
                $scope.instruction = 'The password needs to be more than 4 characters';
                return false;
            }
            return true;
        };

        showInstruction = function(res){
            if (res == 'unused'){
                $scope.instruction = 'successful update now';
            } else if (res == 'wrong'){
                $scope.instruction = 'The password is incorrect';
            } else if (res == 'reserved'){
                $scope.instruction = 'The user name is not allowed';
            } else if (res == 'used'){
                $scope.instruction = 'The user name has been already used';
            } else if (res == 'inactive'){
                $scope.instruction = 'The account status is inactive';
            } else if (res == 'unable'){
                $scope.instruction = "Changing user profile is unable";
            } else {
                $scope.instruction = "Successfully Update User Profile!";
            }
        };

    });