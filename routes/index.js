const express = require("express");
const moment = require("moment");
const router = express.Router()
const {ensureAuth, ensureGuest } = require("../middleware/auth");

const Story = require("../models/Story")

//login route/landing page
router.get('/', ensureGuest, (req,res)=>{
    res.render("login",{
        layout: "login"
    });
});

//dashboard
router.get('/dashboard', ensureAuth, async (req,res)=>{
    try{
        const stories = await Story.find({user: req.user.id}).lean()
        res.render("dashboard",{
            name:req.user.firstName,
            body:req.user.displayName,
            stories,
            moment:moment,
            
        });
    }catch(err){
        console.error(err)
        res.render("error/500");
    }
    
});

module.exports = router