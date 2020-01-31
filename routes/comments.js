var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//===============
//COMMENTS ROUTES
//===============

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	//find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res){
	//look up campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// = from model
					//save comment
					comment.save()
					campground.comments.push(comment);
					//connect new comment to campground
					campground.save();
						//redirect to show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;