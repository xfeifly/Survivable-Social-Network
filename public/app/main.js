//simulate the single one page
var app = angular.module('myApp',['ui.router', 'ngMessages', 'ui.bootstrap', 'HomeService', 'PartnerService', 'UserService','chatService',
    'AnnouncementService','supplyService','myStartFromFilter','myStopWordFilter','myAnnStopWordFilter']);
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
        $stateProvider
        .state('home', {
            url: '/', //A url fragment with optional parameters. When a state is navigated or transitioned to, the $stateParams service will be populated with any parameters that were passed.
            templateUrl: 'partials/index.jade',
            controller: 'HomePageController'
        })
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'partials/lobby.jade',
            controller: 'LobbyPageController'
        })
        .state('lobby.messages', {
            url: '/messages',
            views: {
                "messages": {
                    templateUrl: 'partials/chatPublicly.jade',
                    controller: 'chatController'
                }
            }
        })
        .state('lobby.directory', {
            url: '/directory',
            views: {
                "directory": {
                    templateUrl: 'partials/directory.jade',
                    controller: 'DirectoryController'
                }
            }
        })
        .state('lobby.privateChat', {
            url: '/directory/:userName',
            views: {
                "privateChat": {
                    templateUrl: 'partials/chatPrivately.jade',
                    controller: 'chatPrivateController'
/*                    params: {
                        'userName' : null,
                        'isOnline' : null,
                        'statusCode' : null,
                        'updatedAt' : null,
                        'location' : null
                    }*/
                }
            }
        })
        //video chat
        .state('lobby.videoChat', {
            url: '/directory/video/:userName',
            views: {
                "videoChat": {
                    templateUrl: 'partials/videoChat.jade',
                    controller: 'videoChatController'

                }
            }
        })
        .state('lobby.shareStatus', {
            url: '/shareStatus',
            views: {
                "shareStatus": {
                    templateUrl: 'partials/shareStatus.jade',
                    controller: 'shareStatusController'
                }
            }
        })
        .state('lobby.announcement', {
            url: '/announcement',
            views: {
                "announcement": {
                    templateUrl: 'partials/postAnnouncement.jade',
                    controller: 'announcementController'
                }
            }
        })
        .state('lobby.measurement', {
            url: '/measurement',
            views: {
                "measurement": {
                    templateUrl: 'partials/measurement.jade',
                    controller: 'measurementController'
                }
            }
        })
        .state('lobby.welcome', {
            views: {
                "home": {
                    templateUrl: 'partials/welcome.jade'
                }
            }
        })
        .state('lobby.privateSupply',{
            url:'/privateSupply',
            views:{
                "privateSupply":{
                    templateUrl:'partials/privateSupply.jade',
                    controller:'privateSupplyController'
                }
            }
        })
        .state('lobby.publicWarehouse',{
            url:'/publicWarehouse',
            views: {
                "publicWarehouse": {
                    templateUrl: 'partials/publicWarehouse.jade',
                    controller: 'publicWarehouseController'
                }
            }
        })

        .state('lobby.adminProfile', {
            url: '/adminProfile',
            views: {
                "adminProfile": {
                    templateUrl: 'partials/adminProfile.jade',
                    controller: 'adminProfileController'
                }
            }
        })

        .state('lobby.editProfile', {
            url: '/editProfile/:userName',
            views: {
                "editProfile": {
                    templateUrl: 'partials/editProfile.jade',
                    controller: 'editProfileController'
                }
            }
        })
});

