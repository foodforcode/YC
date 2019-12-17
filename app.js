var express = require("express");
var app = express();

app.get("/", function(req, res){
	res.send("landing page");
});



app.listen(3000, function(){
	console.log("yelpin!!!");
});

git remote add origin https://github.com/foodforcode/YC.git
git push -u origin master