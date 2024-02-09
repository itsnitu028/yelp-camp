const express=require("express");
const router=express.Router();
const {isLoggedIn,isAuthor,validateCampground} =require('../middleware.js');
const catchAsync=require("../utils/catchAsync.js");
const multer  = require('multer')
const {storage}=require('../cloudinary/index.js')
const upload = multer({ storage })

const ExpressError = require('../utils/ExpressError.js');
const Campground=require('../models/Campground.js');
const {campgroundSchema}=require('../schema.js');
const campground=require('../controllers/campground.js')

router.route('/')
      .get(catchAsync(campground.index))
      .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))

router.get('/new',isLoggedIn,catchAsync(campground.renderNewForm))

router.route('/:id')
      .get(catchAsync(campground.showCampground))
      .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
      .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm));

module.exports=router;
