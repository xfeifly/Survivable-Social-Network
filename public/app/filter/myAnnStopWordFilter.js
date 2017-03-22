/**
 * Created by Ethan on 3/22/16.
 */
angular.module('myAnnStopWordFilter', [])
    .filter('annStopWordFilter', function() {
        return function(input, searchText){
            var stopWordList = ["a","able","about","across","after","all","almost","also","am","among","an","and","any",
                "are","as","at","be","because","been","but","by","can","cannot","could","did","do",
                "does","either","else","ever","every","for","from","get","got","had","has","have","he",
                "her","hers","him","his","how","however","i","if","in","into","is","it","its",
                "just","least","let","likely","may","me","might","most","must","my","neither","nor","not",
                "of","off","often","on","only","or","other","our","own","rather","said","say","says",
                "she","should","since","so","some","than","that","the","their","them","then","there","these",
                "they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which",
                "while","who","whom","why","will","with","would","why","yet","your"];
            if (searchText == undefined) {
                searchText = "**";
            }
            for (var i = 0; i < stopWordList.length; i++ ) {
                var rg = new RegExp('\\b' + stopWordList[i] + '\\b' ,"g");
                searchText = searchText.replace(rg,"");
            }
            var returnArray = [];
            var searchTextSplit = searchText.split(' ');
            //console.log("length:" + input.length);
            for(var x = 0; x < input.length; x++){
                var count = 0;
                for(var y = 0; y < searchTextSplit.length; y++){
                    if(input[x].message.indexOf(searchTextSplit[y]) !== -1){
                        count++;
                    }
                }
                if(count == searchTextSplit.length){
                    returnArray.push(input[x]);
                }
            }
            return returnArray;
        }
    });



