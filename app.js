var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
errorController = require('./controllers/error'),
mongoose = require('mongoose'),
flash = require('connect-flash'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
methodOverride = require('method-override'),
Blog = require('./models/blog'),
Comment = require('./models/comment'),

// Other routes added
// getting router
commentRoutes = require('./routes/comments'),
blogRoutes = require('./routes/blogs'),
indexRoutes = require('./routes/index'),
User = require('./models/user');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport configuration
app.use(require('express-session')( {
  secret: 'There are no men like me; only me',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/blogs/:id/comments', commentRoutes);
app.use('/blogs', blogRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb://localhost:27017/crypton')
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });

