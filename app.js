if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const Listing = require("../Major project/models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("../Major project/models/review.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn, saveRedirectUrl,isOwner,isAuthor}=require("./middleware.js");
const listingcontrol=require("./controller/listing.js");
const reviewcontrol=require("./controller/review.js")
const usercontrol=require("./controller/users.js")
const multer  = require('multer')
const {storage}=require("./cloudConfig.js")
const upload = multer({ storage })
const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
const dbURL=process.env.ATLASDB_URL;

app.engine('ejs', ejsmate);
main().then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user
    next();
})
//Authentication
app.get("/signup", usercontrol.getsignup)
app.post("/signup", wrapAsync(usercontrol.postsignup))

app.get("/login", usercontrol.getlogin)

app.post("/login",
    saveRedirectUrl,
     passport.authenticate("local",
    {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    usercontrol.postlogin)

app.get("/logout",usercontrol.login)

// index route
app.get("/listing", wrapAsync(listingcontrol.index))
//new route
app.get("/listing/new",isLoggedIn,listingcontrol.renderNewform)
//show route
app.get("/listing/:id", wrapAsync(listingcontrol.show))
//Create route
app
.post("/listings",
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingcontrol.createListing)
);
// edit route
app.get("/listings/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontrol.edit))
//update route
app.put("/listings/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
     wrapAsync(listingcontrol.update))
//delete route
app.delete("/listings/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(listingcontrol.delete))
//review
//post route
app.post("/listings/:id/reviews",
    isLoggedIn,
    reviewcontrol.postreview
    )
// Delete review route
app.delete("/listings/:id/review/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewcontrol.deletereview))
// app.get("/testlisting",async(req,res)=>{
//    let samplelisting=new Listing({
//     title:"My home",
//     description:"By the beach",
//     price:12900,
//     location:"Goa",
//     country:"India",
//    });

//    await samplelisting.save();
//    console.log("response is save");
//    res.send("sucessfull listing"); 
// });
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Somthing went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err })
    //    res.status(statusCode).send(message);
})
app.listen(8080, () => {
    console.log("app is listening")
});