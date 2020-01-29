var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});

// ==========
// AUTH ROUTES
// ==========

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//Handle Sign up/registration
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	 {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});


//logout
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})


var campgrounds = [
		{name: "salmon creek", image: "https://picjumbo.com/wp-content/uploads/skogafoss-waterfall-free-photo-2210x1473.jpg"},
		{name: "Yosemite", image: "https://picjumbo.com/wp-content/uploads/camping-place-on-snowy-mountain-with-fjord-view-2210x1243.jpg"},
		{name: "goat hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"}
	];

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;