var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {campground:campground})
        }
    });
});

router.post("/", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    // add suername and id to commemt
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                };
            });
        };
    });
    //create new comment
    //connect new comment to campground
    //redirect comground show page
});
// Comment Router
router.get("/:comment_id/edit",middleware.checkCommentkOwnShip,  function (req, res){
    Comment.findById(req.params.comment_id,  function(err, foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
        }
    })
});



router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:comment_id", middleware.checkCommentkOwnShip,  function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function (err){
            if(err){
                res.redirect("back")
            }else{
                res.redirect("/campgrounds/" +  req.params.id)
            }
   })
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//     }
// };
//
// function checkCommentkOwnShip(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function (err, foundComment) {
//             if(err){
//                 res.redirect("back")
//             }else {
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         })
//     }else{
//         res.redirect("back");
//     }
// };

module.exports = router;