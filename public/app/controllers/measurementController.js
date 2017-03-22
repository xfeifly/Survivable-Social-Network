angular.module('myApp')
    .controller('measurementController', function ($scope, $state, $location, $http, User) {
//        var userName = User.getUsername();
        var getTimer = 0;
        var postTimer = 0;
        var stopTimer = 0;
        var postReqCnt = 0;
        var getReqCnt = 0;
        var postCount = 0;
        var getCount = 0;
        var postStop = true;
        var getStop = true;

        var duration = 0;
        var interval = 0;
        var data = {
            type: 'public',
            message: '01234567890123456789',
            fromName: User.getUsername(),
            timestamp: '2999/12/31'
        };

        $scope.results = [];
        $scope.instruction = '';

        $scope.startMeasurement = function(){
            if(getStop && postStop) {
                duration = $scope.duration;
                interval = $scope.interval;
                $http({
                    url: '/measurement',
                    method: "GET",
                    params: {duration: duration, interval: interval}
                }).success(function () {
                    $http.get('/measurement/post/start').success(function () {
                        postStop = false;
                        getStop = false;
                        postReqCnt = 0;
                        getReqCnt = 0;
                        postCount = 0;
                        getCount = 0;
                        postTimer = setInterval(sendPostRequest, interval);
                        stopTimer = setTimeout(stopPostRequest, duration * 1000);
                    });
                });
            }
        };

        $scope.stopMeasurement = function(){
            if (postCount) {
                clearInterval(stopTimer);
                stopPostRequest();
            } else if (getCount) {
                clearInterval(stopTimer);
                stopGetRequest();
            }
        };

        sendPostRequest = function(){
            if(!postStop) {
                postReqCnt++;
                $http.post('/measurement/post', data).success(function (data, status) {
                    if (data == 'over') {
                        clearInterval(postTimer);
                        clearInterval(stopTimer);
                        postCount = 0;
                        $scope.instruction = 'The total number of post requests exceeds the limit of 1000';
                    } else {
                        postCount++;
                        $scope.instruction = 'POST ' + postCount;
                        sendPostEnd();
                    }
                });
            }
        };

        stopPostRequest = function(){
            clearInterval(postTimer);
            postStop = true;
            sendPostEnd();
        };



        sendPostEnd = function(){
            if (postStop && postReqCnt == postCount) {
                $http.get('/measurement/post/end').success(function (data) {
                    postCount = 0;
                    data.type = 'POST';
                    data.interval = interval;
                    $scope.results.push(data);

                    $http.get('/measurement/get/start').success(function () {
                        getTimer = setInterval(sendGetRequest, interval);
                        stopTimer = setTimeout(stopGetRequest, duration * 1000);
                    });
                });
            }
        };

        sendGetRequest = function(){
            if(!getStop) {
                getReqCnt++;
                $http.get('/measurement/get').success(function () {
                    getCount++;
                    $scope.instruction = 'GET ' + getCount;
                    sendGetEnd();
                });
            }
        };

        stopGetRequest = function(){
            clearInterval(getTimer);
            getStop = true;
            sendGetEnd();
            /*
            $http.get('/measurement/get/end').success(function(data){
                getCount = 0;
                $scope.instruction = '';
                data.type = 'GET';
                data.interval = interval;
                $scope.results.push(data);
            });
            */
        };

        sendGetEnd = function(){
            if (getStop && getReqCnt == getCount) {
                $http.get('/measurement/get/end').success(function (data) {
                    getCount = 0;
                    $scope.instruction = '';
                    data.type = 'GET';
                    data.interval = interval;
                    $scope.results.push(data);
                });
            }
        };

        sendGetEnd = function(){
            if (getStop && getReqCnt == getCount) {
                $http.get('/measurement/get/end').success(function (data) {
                    getCount = 0;
                    $scope.instruction = '';
                    data.type = 'GET';
                    data.interval = interval;
                    $scope.results.push(data);
                });
            }
        };
    });