var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Comment = require("./models/comment"),  //one dot is same level
    User = require("./models/user");

//require routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
app.use(bodyParser.urlencoded({extended: true}));//for POST body

//mongoose.connect("mongodb://localhost/YelpCamp"); //create or use db called YelpCamp
//mongoose.connect("mongodb://harry28:harry28@ds117495.mlab.com:17495/rapforum");
mongoose.connect(process.env.DATABASEURL);

//localhost is your mongodb address, need to run by mongod

//SCHEMA SETUP
var Camp = require("./models/campground");//mongoose camps model
var seedDB = require("./seeds");
//use for one time
//seedDB();


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

/** We use RESTful - CRUD: create read update destroy*/

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again Rusty is cutest!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass currentUser into every View Page!
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelpcamp server has started!");
});