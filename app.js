var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


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


app.get("/", function(req, res){
	res.render("landing");
});

var campgrounds = [
		{name: "salmon creek", image: "https://picjumbo.com/wp-content/uploads/skogafoss-waterfall-free-photo-2210x1473.jpg"},
		{name: "Yosemite", image: "https://picjumbo.com/wp-content/uploads/camping-place-on-snowy-mountain-with-fjord-view-2210x1243.jpg"},
		{name: "goat hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"}
	];
//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
		res.render("index", {campgrounds:allcampgrounds});
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
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template of campground
			res.render("show", {campground: foundCampground});
		}
	});
});

app.get("*", function(req, res){
	res.send("This page does not exist yet!")
});

app.listen(3000, function(){
	console.log("yelpin!!!");
});