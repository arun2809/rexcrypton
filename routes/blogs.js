var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Blog = require('../models/blog');
var middleware = require('../middleware/index');
var cont = require("../controllers/blog")
// var errorController = require('./controllers/error');

const ITEMS_PER_PAGE = 12;

 router.get('/', (req, res) => {
    const page = +req.query.page || 1;
    let totalBlogs;

    Blog.find().countDocuments().then(numBlogs => {
        totalBlogs = numBlogs;
        return Blog.find().sort({created: -1}).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    })
    .then(allBlogs => {
        res.render('blogs/index', {
            blogs: allBlogs,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalBlogs,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalBlogs / ITEMS_PER_PAGE)})
    })
});

// Post to all blogs
router.post('/', middleware.isLoggedIn, (req, res) => {
    var title = req.body.title;
    var image = req.body.image;
    var content = req.body.content;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    console.log(req.body.content);
    var newBlog = {title: title, image: image, content: content, author: author}
    // create the blog

    console.log(newBlog);

    Blog.create(newBlog, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    });
});

// Render the new blog form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('blogs/new');
});

router.get("/:id",cont.blogurl)

// Show more info about a blog

    // check if the req.params id or paramater is valid
    // in the blog database

   // if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        // find blog with provided ID
        // Blog.find({title:"how-to-read"}).populate('comments').exec((err, foundBlog) => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         router.get('/"'+foundBlog.title+'"', (req, res) => {
        //         console.log("foundBlog",foundBlog)
        //         res.render('blogs/show', {blog: foundBlog});
        //     })
        //     }});
    // } else {
    //     // redirect to 404 page
    //     res.status(404).render('404');
    // }




// edit blog
router.get('/:id/edit', middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        res.render('blogs/edit', {blog: foundBlog})
    });
});

// update blog
router.put('/:id', middleware.checkBlogOwnership, (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        // find and update
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
            if(err) {
                res.redirect('/blogs');
            } else {
                // redirect
                res.redirect('/blogs/' + req.params.id);
            }
        });
    } else {
        res.render('blogs/show', {blog: foundBlog});
    }
});

// delete blog route
router.delete('/:id', middleware.checkBlogOwnership, (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

// router.use(errorController.get404);

module.exports = router;