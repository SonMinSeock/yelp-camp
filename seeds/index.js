const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

// mongoose and mongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Mongo Connection Open!!"))
  .catch((err) => console.log("Mongo connecting Error : ", err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "64cf7291e1701ad5c1247d1e",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dvpkhjgaf/image/upload/v1694478698/YelpCamp/d6mliao8j9f9pfq5zd2o.png",
          filename: "YelpCamp/qbjz1pdqbdrykilqn6ip",
        },
      ],
      description: "캠핑장 내용",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
