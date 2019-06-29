var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware/index');

// root route
router.get('/', (req, res) => {
    res.redirect('/blogs');
});

// Auth routes
// show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            req.flash('error', 'Email already in use');
            res.redirect('/register');
        } else {
            var newUser = new User({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                avatar: req.body.avatar,
                email: req.body.email
            });

            User.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.render('register');
                }
                passport.authenticate('local')(req, res, () => {
                    req.flash('success', 'Registration successful');
                    res.redirect('/blogs');
                })
            })
        }
    })
});

// show login form
router.get('/login', (req, res) => {
    res.render('login');
})

// handling login logic
router.post('/login', passport.authenticate('local', {successRedirect: '/blogs', failureRedirect: '/login'}), (req, res) => {
});

router.get('/users/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash('error', 'Something went wrong there');
            res.redirect('/blogs');
        }
        res.render('users/show', {user: user});
    })
})

router.get('/privacy', (req, res) => {
    res.render('privacy');
})

router.get('/legal/terms-of-use', (req, res) => {
    res.render('terms');
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/blogs');
});

module.exports = router;