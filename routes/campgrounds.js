var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
		res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user});
								//{variable: property}
		}
	});
});

//CREATE - add new campground to DB
router.post("/campgrounds", function(req, res){
	//get data from form and add to array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	//create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to page (refresh)
			res.redirect("/campgrounds");
		}
	});
});
//NEW - show form to create new campground
router.get("/campgrounds/new", function(req, res){
	res.render("new");
});

//SHOW - show more info of one campground
router.get("/campgrounds/:id", function(req, res){
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template of campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

module.exports = router;