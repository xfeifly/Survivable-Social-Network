var expect = require('expect.js');
var Citizen = require('../models/Citizen.js');
var directory = require('../models/Directory.js');
var db = require('../config/db.js');

suite('Unit Test for Join Community', function(){
	test('Compare the correct name to Citizen name', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.isNameMatch(name)).to.be.ok;
		done();
	});
	test('Create citizen class', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass, statusCode: 'OK', updatedAt: '2016/02/20', location : 'JAPAN'});
		expect(citizen.display().statusCode).to.eql('OK');
		done();
	});
	test('Compare the correct pass to Citizen pass', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.isPassMatch(pass)).to.be.ok;
		done();
	});

	test('Compare the incorrect name to Citizen name', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.isNameMatch('aaaa')).to.not.be.ok;
		done();
	});

	test('Compare the incorrect pass to Citizen pass', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.isPassMatch('aaaa')).to.not.be.ok;
		done();
	});

	test('Display Citizen name', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.display().userName).to.eql(name);
		done();
	});

	test('Display Citizen pass', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		expect(citizen.display().password).to.not.be.ok;
		done();
	});

	test('Update Citizen to online', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		citizen.updateIsOnline(true);
		expect(citizen.display().isOnline).to.eql('Online');
		done();
	});

	test('Update Citizen to offline', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		citizen.updateIsOnline(false);
		expect(citizen.display().isOnline).to.eql('Offline');
		done();
	});

	test('Save Citizen in DB citizens', function(done){
		directory.deleteCitizenDB();
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		citizen.save();
		db.getAllUser(function(row){
			expect(name).to.eql(row.userName);
			expect(pass).to.eql(row.password);
		});
		done();
	});

	test('Add Citizen to Directory and Display citizens in Directory', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		directory.add(citizen);
		var user = directory.display().pop();
		expect(user.isNameMatch(name)).to.be.ok;
		expect(user.isPassMatch(pass)).to.not.be.ok;
		done();
	});

	test('Find exist citizen in Directory', function(done){
		var name = 'misteroda';
		var pass = 'takuma';
		var citizen = new Citizen({userName: name, password: pass});
		directory.add(citizen);
		directory.findName(name, function(user){
			expect(user.isNameMatch(name)).to.be.ok;
			expect(user.isPassMatch(pass)).to.be.ok;
		});
		done();
	});

	test('Find unexist citizen in Directory', function(done){
		var name = 'aaaa';
		directory.findName(name, function(user){
			expect(user).to.not.be.ok;
		});
		done();
	});
});