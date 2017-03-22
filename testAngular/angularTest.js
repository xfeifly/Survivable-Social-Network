/**
 * Created by Ethan on 3/23/16.
 */

describe('test myStartFromFilter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('myStartFromFilter');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should splice a array from certain postition', function () {
        // Arrange.
        var foo = ["Banana", "Orange", "Apple", "Mango"];
        var result;

        // Act.
        result = $filter('startfrom')(foo, 2);
        // Assert.
        expect(result).toEqual(["Apple", "Mango"]);
    });
});

describe('test myAnnStopWordFilter', function () {
        'use strict';
        var $filter;
        beforeEach(function () {
            module('myAnnStopWordFilter');
            inject(function (_$filter_) {
                $filter = _$filter_;
            });
        });

        it('test search with a word without stop word', function () {
            var result;
            var foo = [ {"message":"Hi, hello" },
                {"message":"Hey" },
                {"message":"what are you doing" }];
            // Act.
            result = $filter('annStopWordFilter')(foo, "Hi ");
            // Assert.
            expect(result).toEqual([{"message":"Hi, hello" }]);
        });

        it('test search with multiple words without stop word', function () {
            var result;
            var foo = [ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }];
            // Act.
            result = $filter('annStopWordFilter')(foo, "ar");
            // Assert.
            expect(result).toEqual([{"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }]);
        });

        it('test search with single stop word', function () {
            var result;
            var foo = [ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }];
            // Act.
            result = $filter('annStopWordFilter')(foo, "are");
            // Assert.
            expect(result).toEqual([ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }]);
        });

        it('test search with multiple words :sequence insentitive', function () {
            var result1,result2;
            var foo = [ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }];
            // Act.
            result1 = $filter('annStopWordFilter')(foo, "ou re");
            result2 = $filter('annStopWordFilter')(foo, " ou");
            // Assert.
            expect(result1).toEqual(result2);
        });

        it('test search with multiple stop words', function () {
            var result;
            var foo = [ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }];
            // Act.
            result = $filter('annStopWordFilter')(foo, "how are");

            // Assert.
            expect(result).toEqual([ {"message":"Hi, hello" },
                {"message":"How are you" },
                {"message":"what are you doing" },
                {"message":"are you there" }]);
        });

});

describe('test stopWordFilterr', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('myStopWordFilter');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });


    });

    it('test search with a word without stop word', function () {
        var result;
        var foo = [ {"message":"Hi, hello" },
            {"message":"Hey" },
            {"message":"what are you doing" }];
        // Act.
        result = $filter('stopWordFilter')(foo, "Hi");

        // Assert.
        expect(result).toEqual([{"message":"Hi, hello" }]);
    });

    it('test search with multiple words without stop word', function () {
        var result;
        var foo = [ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }];
        // Act.
        result = $filter('stopWordFilter')(foo, "ar");

        // Assert.
        expect(result).toEqual([{"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }]);
    });

    it('test search with single stop word', function () {
        var result;
        var foo = [ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }];
        // Act.
        result = $filter('stopWordFilter')(foo, "are");

        // Assert.
        expect(result).toEqual([ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }]);
    });


    it('test search with multiple words :sequence insentitive', function () {
        var result1,result2;
        var foo = [ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }];
        // Act.
        result1 = $filter('stopWordFilter')(foo, "ou re");
        result2 = $filter('stopWordFilter')(foo, " ou");
        // Assert.
        expect(result1).toEqual(result2);
    });

    it('test search with multiple stop words', function () {
        var result;
        var foo = [ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }];
        // Act.
        result = $filter('stopWordFilter')(foo, "how are");

        // Assert.
        expect(result).toEqual([ {"message":"Hi, hello" },
            {"message":"How are you" },
            {"message":"what are you doing" },
            {"message":"are you there" }]);
    });

});