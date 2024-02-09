const express=require("express");
const router=express.Router({mergeParams:true});

const catchAsync=require("../utils/catchAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const review=require('../controllers/review.js')


const Campground=require('../models/Campground.js');
const Review=require('../models/review.js');

const {reviewSchema}=require('../schema.js');
const {validateReview,isLoggedIn,isreviewAuthor}=require('../middleware.js')

router.post('/',isLoggedIn,validateReview,catchAsync(review.createReview));
router.delete('/:reviewId',isLoggedIn,isreviewAuthor,catchAsync(review.deleteReview));


module.exports=router;