if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config();
}

// console.log(process.env.API_KEY)



const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
// const session=require('express-session');
const flash=require('connect-flash');
const Campground=require('./models/Campground.js');
const Review=require('./models/review.js');
const catchAsync=require("./utils/catchAsync.js");
const joi=require("joi");
const {campgroundSchema,reviewSchema}=require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const Joi = require('joi');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js')


const mongoSanitize=require('express-mongo-sanitize');

const userRoutes=require('./routes/user.js')
const campgroundRoutes=require('./routes/campground.js');
const reviewRoutes=require('./routes/review.js')

const session = require('express-session');
const MongoStore = require('connect-mongo');


app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)
app.use(mongoSanitize({
    replaceWith:'_'
}));

//const dbUrl='mongodb://127.0.0.1:27017/yelp-camp'
 const dbUrl=process.env.DB_URL;
mongoose.connect(dbUrl,
{
    useNewUrlParser:true,
})
.then(()=>{
    console.log("mongoose connection open");
})
.catch(err=>{
    console.log("mongoose connection error");
    console.log(err);
})
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
const sessionConfig={
    store,
    name:'session',
      secret:'thisisnotagood secret',
      resave:false,
      saveUninitialized:true,
      cookie:{
        // secure:true,
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
      }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;   //gives undefined.if no user is loggedin
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campground',campgroundRoutes);
app.use('/campground/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
     res.render('home');
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
})
app.use((err,req,res,next)=>{
    const { statusCode=500}=err;
    if(!err.message) err.message='oh no!Something went wrong!';
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log('port listening at 3000');
})
