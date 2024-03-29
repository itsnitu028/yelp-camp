const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;
const ImageSchema=new Schema({
    url:String,
    filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
       return this.url.replace('/upload','/upload/w_100')
})
const CampgroundSchema=new Schema({
    title:String,
    price:Number,
    images:[ImageSchema],
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        const res=await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
        console.log(res);
    }
})
module.exports=mongoose.model('Campground',CampgroundSchema);