var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//require routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index")

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); Seed the DB


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

//MIDDLEWARE
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	res.locals.info = req.flash("info");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.get("*", function(req, res){
	res.send("This page does not exist yet!")
});

app.listen(process.env.PORT, process.env.IP);