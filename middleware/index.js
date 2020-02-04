var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = 
	function(req, res, next) {
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("warning", "Campground was not found");
				res.redirect("back");
			} else {
				//does user own post?
		if(foundCampground.author.id.equals(req.user._id)){
		//.author.id is mongoose object (cannot use ===)
				next();
				} else {
					req.flash("info", "Cannot modify someone else's post");
					return res.redirect("back");
				}
			}
		});
		} else {
			res.redirect("back");	
			}
	};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				//does user own post?
		if(foundComment.author.id.equals(req.user._id)){
		//.author.id is mongoose object (cannot use ===)
				next();
				} else {
					req.flash("info", "Cannot modify someone else's comment");
					res.redirect("back");
				}
			}
		});
		} else {
			req.flash("error", "You must be logged in!");
			res.redirect("back");	
			}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login");
	res.redirect("/login");
};


module.exports = middlewareObj