const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../models/user');
const catchAsync=require("../utils/catchAsync.js");
const { storeReturnTo } = require('../middleware');

const user=require('../controllers/user.js');

router.route('/register')
      .get(user.renderRegister)
      .post(catchAsync(user.register))

router.route('/login')
      .get(user.renderLogin)
      .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.login);

router.get('/logout', user.logout); 

module.exports=router;


// router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
//     req.flash('success','Welcome Back!');
//     const redirectUrl=req.session.returnTo || '/campground';
//     delete req.session.returnTo;
//     // res.redirect('/campground');
//     res.redirect(redirectUrl);
// })