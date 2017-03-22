var expect = require('expect.js');
var Citizen = require('../models/Citizen.js');
//var directory = require('../models/Directory.js');

suite('Unit Test for Administer User Profile', function(){
    test('Activate Citizen', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateAccount(true);
        expect(citizen.display().accountStatus).to.eql('Active');
        done();
    });

    test('Deactivate Citizen', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateAccount(false);
        expect(citizen.display().accountStatus).to.eql('Inactive');
        done();
    });

    test('Update Citizen Name', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.changeName('andrew');
        expect(citizen.display().userName).to.eql('andrew');
        done();
    });

    test('Update Citizen Password', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.changePassword('andrew');
        expect(citizen.display().password).to.eql('andrew');
        done();
    });

    test('Update Citizen privilege', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.changePrivilege('Administrator');
        expect(citizen.display().privilege).to.eql('Administrator');
        done();
    });

    //test('Delete All Data in DB', function(done){
    //    directory.deleteCitizenDB();
    //    done();
    //});
});
