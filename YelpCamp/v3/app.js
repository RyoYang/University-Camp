var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	User       	  = require("./models/user"),
    Campground    = require("./models/campground"),
    seedDB        = require("./seeds"),
    Comment       = require("./models/comment")

var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index")



// seedDB();  // input the database seed

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))

// app.set('views', __dirname + '/views/partials')
//**************************Mongodb******************************
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true,useUnifiedTopology: true});
app.set("view engine", "ejs");
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

// PASSORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!");
});
app.listen(3002);















