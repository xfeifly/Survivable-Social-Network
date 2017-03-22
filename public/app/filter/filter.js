/**
 * Created by Ethan on 3/21/16.
 */
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
angular.module('myStartFromFilter', [])
    .filter('startfrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


