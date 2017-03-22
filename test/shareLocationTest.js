var expect = require('expect.js');
var Citizen = require('../models/Citizen.js');
//var directory = require('../models/Directory.js');


suite('Unit Test for Share Location', function(){
    test('Update Citizen status with GPS', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var status = {
            statusCode: 'OK',
            updatedAt: '2016/01/01 00:00',
            location: {
                name: 'home',
                gps: 1,
                lat: 10,
                lng: 10
            }
        };
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateStatus(status);
        expect(citizen.display().statusCode).to.eql(status.statusCode);
        expect(citizen.display().updatedAt).to.eql(status.updatedAt);
        expect(citizen.display().location).to.eql(status.location);
        done();
    });

    test('Update Citizen status without GPS', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var status = {
            statusCode: 'OK',
            updatedAt: '2016/01/01 00:00',
            location: {
                name: 'home',
                gps: 0,
                lat: 0,
                lng: 0
            }
        };
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateStatus(status);
        expect(citizen.display().statusCode).to.eql(status.statusCode);
        expect(citizen.display().updatedAt).to.eql(status.updatedAt);
        expect(citizen.display().location).to.eql(status.location);
        done();
    });

});

