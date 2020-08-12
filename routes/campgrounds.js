var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX ROUTE
router.get("/", function(req, res) {
	//GET all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	})
})

//CREATE ROUTE
router.post("/", isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	//CREATE NEW CAMPGROUND SNA SAVE TO DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	})

	//get data from form and add to campgrounds array
	//redirect back to campgrounds page
})

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new.ejs");
})

//SHOW ROUTE
router.get("/:id", function(req, res) {
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			//render show template
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
	
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
};

module.exports = router;
