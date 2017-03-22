
var expect = require('expect.js');
var Citizen = require('../models/Citizen.js');
var directory = require('../models/Directory.js');


suite('Unit Test for Share Supply', function(){
    test('Update supply', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateSupply(10, 20);
        expect(citizen.supply.food).to.eql(10);
        expect(citizen.supply.water).to.eql(20);
        done();
    });

    test('Give supply with success', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateSupply(10, 20);
        Citizen.updatePublicSupply(0, 0);
        expect(citizen.giveSupply(5, 5)).to.be.ok;
        expect(citizen.supply.food).to.eql(5);
        expect(citizen.supply.water).to.eql(15);
        expect(Citizen.publicSupply().food).to.eql(5);
        expect(Citizen.publicSupply().water).to.eql(5);
        done();
    });

    test('Give supply with failure', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateSupply(10, 20);

        expect(citizen.giveSupply(15, 15)).to.not.be.ok;
        expect(citizen.supply.food).to.eql(10);
        expect(citizen.supply.water).to.eql(20);
        done();
    });

    test('Get supply with success', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateSupply(0, 0);
        Citizen.updatePublicSupply(10, 20);
        expect(citizen.getSupply(5, 15)).to.be.ok;
        expect(citizen.supply.food).to.eql(5);
        expect(citizen.supply.water).to.eql(15);
        expect(Citizen.publicSupply().food).to.eql(5);
        expect(Citizen.publicSupply().water).to.eql(5);
        done();
    });

    test('Get supply with failure', function(done){
        var name = 'misteroda';
        var pass = 'takuma';
        var citizen = new Citizen({userName: name, password: pass});
        citizen.save();
        citizen.updateSupply(10, 20);

        Citizen.updatePublicSupply(0, 0);
        expect(citizen.getSupply(15, 15)).to.be.ok;
        expect(citizen.supply.food).to.eql(10);
        expect(citizen.supply.water).to.eql(20);
        expect(Citizen.publicSupply().food).to.eql(0);
        expect(Citizen.publicSupply().water).to.eql(0);
        done();
    });

    test('Delete All Data in DB', function(done){
        directory.deleteCitizenDB();
        done();
    });

});


