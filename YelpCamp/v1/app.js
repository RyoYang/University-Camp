var express = require("express")
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
var campgrounds = [
{name: "Wang Yang", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
{name: "Zhang Hao", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
{name: "Shang Yue", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
{name: "Wang Yang", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
{name: "Zhang Hao", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
{name: "Shang Yue", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"}
];

// app.set('views', __dirname + '/views/partials')
app.set("view engine", "ejs")
app.get("/", function(req, res){
	res.render("landing");
	// res.send("this will be the landing page");
});

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds: campgrounds})
});

app.post("/campgrounds",function(req, res){
	// res.send("You HIT the POST!")
	var name = req.body.name;
	var image = req.body.image;
	var newcampground = {name:name, image:image};
	campgrounds.push(newcampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){


	res.render("new.ejs")
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!");
});
app.listen(3001)