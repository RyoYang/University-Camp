var express     = require("express"), 
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    Campground  = require("./models/campground")
    seedDB      = require("./seeds")
    Comment     = require("./models/comment")

seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true,useUnifiedTopology: true});
app.set("view engine", "ejs")


app.use(bodyParser.urlencoded({extended:true}));
// var campgrounds = [
// {name: "Wang Yang", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Zhang Hao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Shang Yue", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Wang Yang", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Zhang Hao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Shang Yue", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Wang Yang", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Zhang Hao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Shang Yue", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Wang Yang", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Zhang Hao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"},
// {name: "Shang Yue", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTPMUAm8XxZZo19iXELjZYWsSlQk2YDOAnvgFr9uh0iVAEkO8de"}
// ];

// app.set('views', __dirname + '/views/partials')

//**************************Mongodb******************************
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true,useUnifiedTopology: true});
app.set("view engine", "ejs")
// var campgroundSchema = new mongoose.Schema({
// 	name:String,
// 	image:String,
// 	description:String
// });

// Campground.create({
// },function(err, campground){
// 	if(err){
// 		console.log("ERR")
// 	}else{
// 		console.log("New Create Campground!")
// 		console.log("campground")
// 	}
// });

app.get("/", function(req, res){
	res.render("landing");
	// res.send("this will be the landing page");
});


//INDEX show all campgrounds 
app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds})
		}
	});
});


// CREATE all new campground to DB
app.post("/campgrounds",function(req, res){
	// res.send("You HIT the POST!")
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newcampground = {name:name, image:image, description:description};
	// create a new campgrounds and save it in DB
	Campground.create(newcampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

// NEW -show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new")
});

//SHOW -show more info about one campground
app.get("/campgrounds/:id", function(req, res){
		//Find the campground with provied ID

	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			conlose.log(err)
		}else{
			res.render("campgrounds/show", {campground: foundCampground})
			
		}
	});
});

//===========================
//      COMMENT ROUTE
//===========================

app.get("/campgrounds/:id/comments/new", function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground:campground})
		}
	});
})

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}else{
					console.log(comment.author)
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});

			// Comment.create(req.body.comment, function(err, comment){
			// 	if(err){
			// 		console.log(err)
			// 	}else{
			// 		campground.comments.push(comment)
			// 		console.log(campground.comments)
			// 		campground.save()
			// 		res.redirect("/campgrounds/" + campground._id);
			// 	}
			// })
		}

	})
	//create new comment
	//connect new comment to campground
	//redirect comground show page


})




app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!");
});
app.listen(3001)















