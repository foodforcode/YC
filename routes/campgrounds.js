var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //requiring dir will access index file

//INDEX - show all campgrounds
router.get("/", function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
		}
	var newCampground = {name: name, image: image, description: desc, price: price, author: author};
	//create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			req.flash("error", err.message);
			console.log(err);
		} else {
			//redirect back to page (refresh)
			req.flash("success", "New campground has been added!");
			res.redirect("/campgrounds");
		}
	});
});
//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - show more info of one campground
router.get("/:id", function(req, res){
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to show page
			req.flash("success", req.body.campground.name + " has been updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("succes", "Campground was removed!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;