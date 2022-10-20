const express = require("express");
const passport = require("passport");
const router = express.Router()

//auth/google route/landing page
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//callback get /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req,res)=>{
    res.redirect('/dashboard');
});

//logout user /auth/logout
router.get("/logout", (req,res, next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
    
})

module.exports = router