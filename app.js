var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	passport 	= require("passport"),
	LocalStrategy 	= require("passport-local"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment"),
	User 		= require("./models/user"),
	seed		= require("./seed");
	
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");

mongoose.connect(process.env.databaseURL, 
				{useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname+"/public"));
//seed();


//PASSPORT CONFIG
app.use(require("express-session")({
		secret: "Once again Rusty wins cutest Dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//add middleware to all functinos
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);




app.listen(3000, function() {
	console.log('YelpCamp server has started');
})