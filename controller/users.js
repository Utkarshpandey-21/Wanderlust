const User = require("../models/user.js");
module.exports.getsignup=(req, res) => {
    res.render("users/signup.ejs");
}
module.exports.postsignup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeruser = await User.register(newuser, password);
        console.log(registeruser);
        req.login(registeruser,(err)=>{
            if(err){
            return next(err);
            }
            req.flash("success", "Welcome to WanderLust")
            res.redirect("/listing");
        })
    } catch (er) {
        req.flash("error", er.message);
        res.redirect("/signup");
    }
}
module.exports.getlogin=(req, res) => {
    res.render("users/login.ejs");
}
module.exports.postlogin= async (req, res) => {
       req.flash("success","Welcome back to WanderLust !");
       let redirecturl=res.locals.redirectUrl ||"/listing"
       res.redirect(redirecturl);
    }
module.exports.login=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listing")
    });
}