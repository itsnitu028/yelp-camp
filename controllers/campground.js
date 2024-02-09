const Campground=require('../models/Campground');
const {cloudinary}=require('../cloudinary')

module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
}
module.exports.renderNewForm=async(req,res)=>{
    // if(!req.isAuthenticated())
    // {
    //     req.flash('error','you must be signed in');
    //     return res.redirect('/login');
    // }  can do this also bt bettr to write middleware
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground=async(req,res)=>{
    // if(!req.body.campground) throw new ExpressError('invalid campground data',400);
    const campground=new Campground(req.body.campground);
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user._id;
     await campground.save();
    //  console.log(campground);
     req.flash('success','Successfully made a campground');
     res.redirect(`/campground/${campground._id}`);
 }

module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({path:'reviews',
      populate:{
        path:'author'
      }
    }).populate('author');
    // console.log(campground);
    if(!campground)
    {
        req.flash('error','Could not find the required campground');
        return res.redirect('/campground')
    }
    res.render('campgrounds/show.ejs',{campground});
}

module.exports.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground)
    {
        req.flash('error','Could not edit the required campground');
        return res.redirect('/campground')
    }
    res.render('campgrounds/edit.ejs',{campground});
}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({$pull :{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated a campground');
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground');
    res.redirect(`/campground`);
}