var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var db; //= new sqlite3.Database(path.join(__dirname, '../db.sqlite3'));

DB = function(mode) {
	this.mode = mode;
	if(mode) {
		db = new sqlite3.Database(path.join(__dirname, '../dbTest.sqlite3'));
	} else {
		db = new sqlite3.Database(path.join(__dirname, '../db.sqlite3'));
	}
};

DB.prototype.initDatabase = function(){
	var createChatpublicTableQuery = "CREATE TABLE IF NOT EXISTS Chatpublic("
		+ "Name TEXT,"
		+ "Message TEXT,"
		+ "Timestamp TEXT,"
		+ "Filename TEXT,"
		+ "Location TEXT)";
	var createCitizensTableQuery = "CREATE TABLE IF NOT EXISTS citizens("
		+ "userName TEXT,"
		+ "password TEXT,"
		+ "statusCode TEXT,"
		+ "updatedAt TEXT,"
		+ "location TEXT,"
		+ "GPS INTEGER,"
		+ "latitude REAL,"
		+ "longitude REAL,"
		+ "privilege TEXT,"
		+ "accountStatus REAL,"
		+ "food INTEGER,"
		+ "water INTEGER)";
	var createAnnouncementTableQuery = "CREATE TABLE IF NOT EXISTS announcement("
		+ "Fromname TEXT,"
		+ "Announcement TEXT,"
		+ "Timestamp TEXT,"
		+ "Location TEXT)";
	var creatChatprivateTableQuery = "CREATE TABLE IF NOT EXISTS Chatprivate("
		+ "Roomid INTEGER,"
		+ "Name TEXT,"
		+ "Message TEXT,"
		+ "Timestamp TEXT,"
		+ "Filename TEXT,"
		+ "Location TEXT)";
	var creatSupplyTableQuery = "CREATE TABLE IF NOT EXISTS supply("
		+ "owner TEXT,"
		+ "food INTEGER,"
		+ "water INTEGER)";
	db.run(createCitizensTableQuery);
	db.run(createChatpublicTableQuery);
	db.run(creatChatprivateTableQuery);
	db.run(createAnnouncementTableQuery);
	db.run(creatSupplyTableQuery);
};

DB.prototype.changeNormalMode = function(){
	if(this.mode) {
		db.close();
		db = new sqlite3.Database(path.join(__dirname, '../db.sqlite3'));
		this.initDatabase();
		this.mode = false;
	}
};

DB.prototype.changeTestMode = function(){
	if(this.mode) {
		this.deleteAll();
	}
	db.close();
	db = new sqlite3.Database(path.join(__dirname, '../dbTest.sqlite3'));
	this.initDatabase();
	this.mode = true;
};

DB.prototype.dropAll = function(){
	if(this.mode) {
		db.run("DROP TABLE citizens");
		db.run("DROP TABLE Chatpublic");
		db.run("DROP TABLE Chatprivate");
		db.run("DROP TABLE announcement");
	}
};

DB.prototype.saveChatpublic = function(name, message, timestamp, filename, location) {
    var query = "INSERT INTO Chatpublic VALUES (?, ?, ?, ?, ?)";
    db.run(query, name, message, timestamp, filename, location);
};

DB.prototype.saveChatprivate = function(RoomId, name, message, timestamp, filename, location){
	var query = "INSERT INTO Chatprivate VALUES (?, ?, ?, ?, ?, ?)";
	db.run(query, RoomId, name, message, timestamp, filename, location);
};


DB.prototype.getPrivateChatMsg = function(roomid, render) {
	var query = "SELECT * FROM Chatprivate WHERE Roomid = "+ roomid +" ORDER BY ROWID DESC";
	var history = [];
	db.each(query, function(error, row) {
		if(error){
			console.log(error);
		} else if(row) {
			data = {
				roomId: row.Roomid,
				fromName: row.Name,
				message: row.Message,
				timestamp: row.Timestamp,
				filename: row.Filename,
				location: row.Location
			};
			history.unshift(data);
		}
	}, function(err, rows) {
		if(err){
			render(err);
			console.log(err);
		}else{
			render(history);
		}
	});
};

DB.prototype.getPubchatMsg = function(render) {
	var query = "SELECT * FROM Chatpublic ORDER BY ROWID DESC";
	var history = [];
	db.each(query, function(error, row) {
        if (error) {
            console.log(error);
        } else if(row){
			data = {
				fromName: row.Name,
				message: row.Message,
				timestamp: row.Timestamp,
				fromLocation: row.Location,
				picture: row.Filename
			};
			history.unshift(data);
		}
	}, function(err, rows) {
		//console.log(history);
        render(history);
    });
};

DB.prototype.getAllannouncement = function(render) {
	var query = "SELECT * FROM announcement ORDER BY ROWID DESC";
	var history = [];
	db.each(query, function(error, row) {
		if (error) {
			console.log(error);
		} else if(row){
			data = {
				fromName: row.Fromname,
				message: row.Announcement,
				timestamp: row.Timestamp,
				location: row.Location
			};
			history.unshift(data);
		}
	}, function(err, rows) {
		render(history);
	});

};


DB.prototype.getLatestAnnouncement = function(cb) {
	var query = "SELECT * FROM announcement ORDER BY time DESC LIMIT 1";
	db.each(query,function(error, row) {
		if (error) {
			console.log(error);
			cb(null, error);
		} else if (row) {
			cb(row, null);
		} else {
			cb(null, null);
		}
	});
};

DB.prototype.saveAnnouncement = function(senderName, content, time, location){
	var query = "INSERT INTO announcement VALUES (?, ?, ?, ?)";
	db.run(query, senderName, content, time, location);
};

DB.prototype.getAllUser = function(cb, complete){
	var query = "SELECT * FROM citizens";
	db.each(query, function(error, row) {
		if(row) cb(row);
	}, function() {
		complete();
	});
};

DB.prototype.getSupply = function(cb, complete){
	var query = "SELECT * FROM supply";
	db.each(query, function(error, row) {
		if(row) cb(row);
	}, function(){
		complete();
	});
};

DB.prototype.initSupply = function(){
	var query = "INSERT INTO supply VALUES (?, ?, ?)";
	db.run(query, 'public', 0, 0);
};

DB.prototype.publicSupply = function(food, water){
	var query = "UPDATE supply set food = ?, water = ? where owner = ?";
	db.run(query, food, water, 'public');
};

DB.prototype.updateStatus = function(user){
	var query = "UPDATE citizens set statusCode = ?, updatedAt = ?," +
		" location = ?, GPS = ?, latitude = ?, longitude = ? where userName = ?";
	db.run(query, user.statusCode, user.updatedAt, user.location.name,
		user.location.gps, user.location.lat, user.location.lng, user.userName);
};

DB.prototype.updateSupply = function(userName, food, water){
	var query = "UPDATE citizens set food = ?, water = ? where userName = ?";
	db.run(query, food, water, userName);
};

DB.prototype.updateName = function(userName, newName){
	var query = "UPDATE citizens set userName = ? where userName = ?";
	db.run(query, newName, userName);
};

DB.prototype.updatePassword = function(userName, password){
	var query = "UPDATE citizens set password = ? where userName = ?";
	db.run(query, password, userName);
};

DB.prototype.updatePrivilege = function(userName, privilege){
	var query = "UPDATE citizens set privilege = ? where userName = ?";
	db.run(query, privilege, userName);
};

DB.prototype.saveUser = function(user){
	var query = "INSERT INTO citizens VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(query, user.userName, user.password, user.statusCode, user.updatedAt,
		user.location.name, user.location.gps, user.location.lat, user.location.lng,
		user.privilege, user.accountStatus, user.supply.food, user.supply.water);
};


var dbAdapter;
if (dbAdapter === undefined){
	dbAdapter = new DB(false);
	dbAdapter.initDatabase();
	console.log("DB created");
}
module.exports = dbAdapter;



///////////////////////Helper functions for TEST/////////////////////////////////////

DB.prototype.deleteAll = function(){
	db.run("DELETE FROM citizens");
	db.run("DELETE FROM Chatpublic");
	db.run("DELETE FROM Chatprivate");
	db.run("DELETE FROM announcement");

};

/*
DB.prototype.getLastsavedDataforTest = function(type,render){
	if(type === 'public') {
		var query = "SELECT * FROM Chatpublic ORDER BY ROWID DESC LIMIT 1";
		var history = [];
		db.each(query, function(error, row) {
			if (error) {
				console.log(error);
			} else if(row){
				data = {
					fromName: row.Name,
					message: row.Message,
					timestamp: row.Timestamp
				};
				history.unshift(data);
			}
		}, function(err, rows) {
			render(history);
		});
	}
	else if(type === 'private') {
		var query = "SELECT * FROM Chatprivate ORDER BY ROWID DESC LIMIT 1";
		var history = [];
		db.each(query, function(error, row) {
			if (error) {
				console.log(error);
			} else if(row){
				data = {
					roomId: row.Roomid,
					fromName: row.Name,
					message: row.Message,
					timestamp: row.Timestamp
				};
				history.unshift(data);
			}
		}, function(err, rows) {
			render(history);
		});
	}
	else if(type === 'announce') {
		var query = "SELECT * FROM announcement ORDER BY ROWID DESC LIMIT 1";
		var history = [];
		db.each(query, function(error, row) {
			if (error) {
				console.log(error);
			} else if(row){
				data = {
					fromName: row.Fromname,
					announcement: row.Announcement,
					timestamp: row.Timestamp,
					location: row.Location
				};
				history.unshift(data);
			}
		}, function(err, rows) {
			render(history);
		});
	}

};
*/
