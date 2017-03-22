var express = require('express');
var router = express.Router();
var joinCommunity = require('../controllers/joinCommunity.js');
var postAnnouncement = require('../controllers/postAnnouncement.js');
var shareStatus = require('../controllers/shareStatus.js');
var administerProfile = require('../controllers/administerProfile.js');

var chatPublicly = require('../controllers/chatPublicly.js');
var chatPrivately = require('../controllers/chatPrivately.js');
var measurePerformance = require('../controllers/measurePerformance.js');
var shareSupply = require('../controllers/shareSupply.js');

var multer  = require('multer');
var upload = multer({
    dest: "public/uploads"
});


router.get("/measurement", measurePerformance.initialize);
router.get("/measurement/post/start", measurePerformance.postStart);
router.post("/measurement/post", measurePerformance.post);
router.get("/measurement/post/end", measurePerformance.postEnd);
router.get("/measurement/get/start", measurePerformance.getStart);
router.get("/measurement/get", measurePerformance.get);
router.get("/measurement/get/end", measurePerformance.getEnd);
router.all("/*", measurePerformance.checkMode);

router.get('/', function (req, res) {
	res.render('layout');
});
router.get('/partials/:name', function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name, function (err, html) {
		if (err)
			console.log(err);
		else
			res.send(html);
	});
});

/* REST API */
router.get("/login", joinCommunity.login);
router.get("/logout", joinCommunity.logout);
router.get("/users", joinCommunity.directory);
router.get("/users/:userName", joinCommunity.citizen);
router.post("/users/:userName", joinCommunity.signup);
router.put("/users/:userName", administerProfile.updateProfile);
router.post("/users/:userName/status", shareStatus.status);
router.put("/users/:userName/inactive", administerProfile.deactivate);
router.put("/users/:userName/active", administerProfile.activate);

router.post("/messages/public", chatPublicly.postPublicMsg);
router.get("/messages/public", chatPublicly.getPublicChatMsg);
router.get("/messages/private", chatPrivately.getPrivateChatMsg);
router.post("/messages/private", chatPrivately.postPrivateMsg);

router.post("/pictures/public", upload.single("pubicfile"), chatPublicly.postPublicPicName);
router.get("/pictures/public", chatPublicly.postPublicPic);
router.post("/pictures/private", upload.single("file"), chatPrivately.postPrivatePicName);
router.get("/pictures/private", chatPrivately.postPrivatePic);

router.post("/messages/announcements", postAnnouncement.postAnnouncement);
router.get("/messages/announcements", postAnnouncement.getAllannouncement);

router.get("/supply", shareSupply.publicSupply);
router.post("/supply/give", shareSupply.giveSupply);
router.post("/supply/get", shareSupply.getSupply);
router.post("/supply/update", shareSupply.updateSupply);

/* for test */
router.get("/deleteAllUsers", joinCommunity.deleteCitizenDB);


module.exports = router;
