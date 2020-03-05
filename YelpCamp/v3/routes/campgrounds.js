var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    });
});


// CREATE all new campground to DB
router.post("/", isLoggedIn, function(req, res){
    // res.send("You HIT the POST!")
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = {name:name, image:image, description:description, author:author};

    // create a new campgrounds and save it in DB
    Campground.create(newcampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated)
            res.redirect("/campgrounds");
        }
    });
});

// NEW -show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

//SHOW -show more info about one campground
router.get("/:id", function(req, res){
    //Find the campground with provied ID

    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show", {campground: foundCampground})

        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
};
module.exports = router;