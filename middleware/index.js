var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentkOwnShip = function(req, res, next){
    if(req.isAuthenticated()) {
        if (req.user.username == "Wang") {
            next();
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect("back")
                } else {
                    if (foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            })
        }
    }else {
        res.redirect("back");
    }
};

middlewareObj.checkownship = function(req, res, next){
    if(req.isAuthenticated()) {
        if (req.isAuthenticated()) {
            next();
        } else {
            Campground.findById(req.params.id, function (err, foundCampground) {
                if (err) {
                    res.redirect("back")
                } else {
                    if (foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            })
        }
    }
    else
        {
            res.redirect("back");
        }
};

module.exports = middlewareObj;