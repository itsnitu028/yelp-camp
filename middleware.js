const {campgroundSchema,reviewSchema}=require('./schema');
const ExpressError=require('./utils/ExpressError')
const Campground=require('./models/Campground')
const Review=require('./models/review')
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
       req.session.returnTo=req.originalUrl;
       req.flash('error','you must be signed in');
       return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.boy);
    if(error){
     const msg=error.details.map(el=>el.message).join(',');
     throw new ExpressError(msg,400);
    }
    else{
     next();
    }
  //  console.log(result);
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error','you dont have to permission to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}
module.exports.isreviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
        req.flash('error','you dont have to permission to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.boy);
   // console.log('hi');
    if(error){
        console.log(error);
     const msg=error.details.map(el=>el.message).join(',');
     throw new ExpressError(msg,400);
    }
    else{
     next();
    }
  //  console.log(result);
}
