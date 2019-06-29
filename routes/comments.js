var express = require('express');
var router = express.Router({mergeParams: true});
var Blog = require('../models/blog');
var Comment = require('../models/comment');
var middleware = require('../middleware/index');
var User = require("../models/user");

// Comments route
router.get('/new', middleware.isLoggedIn, (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {blog: blog});
		}
	})
})

router.post('/', middleware.isLoggedIn, (req, res) => {
	// find blog using ID
	Blog.findById(req.params.id, (err, blog) => {
		if(err) {
			console.log('Error:', err);
			res.redirect('/blogs');
		} else {
			// create comment
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					req.flash('error', 'Something went wrong');
					console.log('Error:', err);
				} else {
					// add user id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// var total = Number(req.user.earnings);

					// save comment
					comment.save();
					User.findOneAndUpdate({_id : req.user._id},{$inc : {earnings : 0.005}})
						.then((err,user) => {
							console.log(user.earnings)
						});
					blog.comments.push(comment);
					blog.save();
					res.redirect('/blogs/' + blog._id);
					console.log(req.user.earnings);
					console.log(User.earnings);
    			}
			})
		}
	});
});

// Comment edit route
router.get('/:comments_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
		}
	})
});

// Comment update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

// Comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	// find by the given ID and destroy
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	})
});

module.exports = router;
