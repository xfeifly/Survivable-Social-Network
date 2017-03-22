
var expect = require('expect.js');
var agent = require('superagent');

var PORT = process.env.PORT | 3000;
var HOST = 'http://localhost:'+PORT;

var debug = require('debug')('Node-API-Testing');
var app = require('../app');
app.set('port', PORT);
app.set('testing', true);

var serverInitialized = function() {
	debug('Express server listening on port ' + PORT);
};

var server = app.listen(app.get('port'), serverInitialized())
	.on('error', function(err){
		if(err.code === 'EADDRINUSE'){
			PORT++;
			HOST = 'http://localhost:'+PORT;
			app.set('port', PORT);
			server = app.listen(app.get('port'), serverInitialized)
		}
	});
/*
var testSetup = require('../config/testSetup.js');

testSetup.init();
*/
var userCorrect = {userName: 'cmusv', password: 'cmusv'};
var userWrong = {userName: 'cmusv', password: 'cmusvv'};
var userBanned = {userName: 'about', password: 'cmusv'};
var userUnused = {userName: 'andrew', password: 'cmusv'};

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


suite('Integration Test for Join Community',function(){
	test('test for signup with success', function(done){
		agent.post(HOST+'/users/' + userCorrect.userName)
			.send(userCorrect)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(201);
				expect(res).to.have.property('body');
				expect(res.body).to.have.property('userName');
				done();
			});
	});

	test('test for retrieving users list', function(done){
		agent.get(HOST+'/users')
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(200);
				expect(res).to.have.property('body');
				expect(res.body).to.be.an('array');
				done();
			});
	});

	test('test for retrieving a user data', function(done){
		agent.get(HOST+'/users/'+ userCorrect.userName)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(200);
				expect(res).to.have.property('body');
				expect(res.body).to.have.property('userName');
				expect(res.body.userName).to.eql(userCorrect.userName);
				done();
			});
	});

	test('test for signup with used name', function(done){
		agent.post(HOST+'/users/' + userWrong.userName)
			.send(userWrong)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.not.have.property('userName');
				done();
			});
	});

	test('test for signup with banned name', function(done){
		agent.post(HOST+'/users/' + userBanned.userName)
			.send(userBanned)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.not.have.property('userName');
				done();
			});
	});

	test('test for login with success', function(done){
		agent.get(HOST+'/login')
			.query(userCorrect)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.have.property('userName');
				done();
			});
	});

	test('test for login with wrong password', function(done){
		agent.get(HOST+'/login')
			.query(userWrong)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.not.have.property('userName');
				done();
			});
	});

	test('test for login with unused name', function(done){
		agent.get(HOST+'/login')
			.query(userUnused)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.not.have.property('userName');
				done();
			});
	});

	test('test for login with banned name', function(done){
		agent.get(HOST+'/login')
			.query(userBanned)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.not.have.property('userName');
				done();
			});
	});
});

var announcementcontent = {type: 'announce', fromName: 'q', message: 'OK', timestamp: '123', location: 'cmu'};
suite('Integration Test for Post Announcement',function(){
	test('test for POST announcement', function(done){
		agent.post(HOST+'/messages/announcements')
			.send(announcementcontent)
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(201);
				done();
			});
	});

	test('test for GET all announcement', function(done){
		agent.get(HOST+'/messages/announcements')
			.end(function(err,res){
				expect(err).to.not.be.ok();
				expect(res).to.have.property('statusCode');
				expect(res).to.have.property('body');
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an('array');
				done();
			});
	});
    //
	//test('init DB', function(){
	//	testSetup.init();
	//});
});



//suite('Integration Test for Share Location',function(){
//	test('updating status with GPS of an existing user', function(done){
//		agent.post(HOST+'/users/' + userCorrect.userName + '/status')
//			.send(status)
//			.end(function(err,res){
//				expect(err).to.not.be.ok();
//				expect(res).to.have.property('statusCode');
//				expect(res.statusCode).to.equal(201);
//				done();
//			});
//	});
//
//	test('updating status with GPS of an unexsiting user', function(done){
//		agent.post(HOST+'/users/' + userBanned.userName + '/status')
//			.send(status)
//			.end(function(err,res){
//				expect(err).to.be.ok();
//				expect(res).to.have.property('statusCode');
//				expect(res.statusCode).to.equal(404);
//				done();
//			});
//	});
//
//});


