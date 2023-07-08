const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const campgrouncdSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: { type: [Schema.Types.ObjectId], ref: "Review" },
});

campgrouncdSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", campgrouncdSchema);

module.exports = Campground;
