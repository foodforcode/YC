var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
seedDB();


// Campground.create(
// 	{
// 		name: "Yosemite",
// 		image: "https://picjumbo.com/wp-content/uploads/camping-place-on-snowy-mountain-with-fjord-view-2210x1243.jpg",
// 		description: "Snowy area with great view!"
// 	}, function (err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log(campground.name + " has been added!");
// 			console.log(campgrounds);
// 		}
// 	});

//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "I can't tell you",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========
// AUTH ROUTES
// ==========

//show register form
app.get("/register", function(req, res){
	res.render("register");
});

//Handle Sign up/registration
app.post("/register", function(req, res){
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


app.get("/", function(req, res){
	res.render("landing");
});

//show login form
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", 
	 {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});


//logout
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})


var campgrounds = [
		{name: "salmon creek", image: "https://picjumbo.com/wp-content/uploads/skogafoss-waterfall-free-photo-2210x1473.jpg"},
		{name: "Yosemite", image: "https://picjumbo.com/wp-content/uploads/camping-place-on-snowy-mountain-with-fjord-view-2210x1243.jpg"},
		{name: "goat hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"}
	];

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
		res.render("campgrounds/index", {campgrounds:allCampgrounds});
								//{variable: property}
		}
	});
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

//SHOW - show more info of one campground
app.get("/campgrounds/:id", function(req, res){
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

//===============
//COMMENTS ROUTES
//===============

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	//find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res){
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
					campground.comments.push(comment);
					//connect new comment to campground
					campground.save();
						//redirect to show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	})
})

app.get("*", function(req, res){
	res.send("This page does not exist yet!")
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("yelpin!!!");
});