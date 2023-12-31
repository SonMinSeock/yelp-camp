const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

//const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  // if ((!req.body, campground))
  //   throw new ExpressError("Invalid Campground Data", 400);

  // 정방향 지오코딩
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.author = req.user._id;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  await campground.save();

  console.log("campground : ", campground);

  req.flash("success", "Successfully Made a New Campground!");

  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const {
    params: { id },
  } = req;

  const campground = await Campground.findById(id).populate({ path: "reviews", populate: { path: "author" } });

  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const {
    params: { id },
  } = req;

  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const {
    params: { id },
  } = req;

  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  campground.images.push(...images);

  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: {
        images: {
          filename: {
            $in: req.body.deleteImages,
          },
        },
      },
    });
  }
  // const campground = await Campground.findByIdAndUpdate(id, {
  //   ...req.body.campground,
  // }, { new: true });

  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const {
    params: { id },
  } = req;

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Campground");
  res.redirect("/campgrounds");
};
