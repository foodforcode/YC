var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Yosemite",
// 		image: "https://picjumbo.com/wp-content/uploads/camping-place-on-snowy-mountain-with-fjord-view-2210x1243.jpg"
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
		{name: "goat hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"},
		{name: "salmon creek", image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format"},
		{name: "Yosemite", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"},
		{name: "goat hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format"}
	];

app.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
		res.render("campgrounds", {campgrounds:allcampgrounds});
								//{variable: property}
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

app.post("/campgrounds", function(req, res){
	//get data from form and add to array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
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

app.get("*", function(req, res){
	res.send("This page does not exist yet!")
});

app.listen(3000, function(){
	console.log("yelpin!!!");
});