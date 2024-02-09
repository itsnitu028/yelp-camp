const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors,places } = require('./seedHelpers');
const Campground = require('../models/Campground.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
})
.then(()=>{
    console.log("mongoose connection open");
})
.catch(err=>{
    console.log("mongoose connection error");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random_price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'65b901db425304515755a3fc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet architecto accusantium optio, recusandae hic obcaecati repellendus aspernatur laboriosam fugiat amet necessitatibus est et perspiciatis cupiditate! Repellat aliquam officiis explicabo ducimus.",
            // image:"https://picsum.photos/200/300?random=2",
            images: [
                {
                  url: 'https://res.cloudinary.com/dlck15muk/image/upload/v1706824932/Yelp%20camp/us1e5teks9qi78mdfrgl.jpg',
                  filename: 'Yelp camp/us1e5teks9qi78mdfrgl',
                },
                {
                  url: 'https://res.cloudinary.com/dlck15muk/image/upload/v1706824932/Yelp%20camp/op54qfjoaqg9adk0mhu3.jpg',
                  filename: 'Yelp camp/op54qfjoaqg9adk0mhu3',
                }
              ],
            price:random_price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



