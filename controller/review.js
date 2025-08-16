const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
module.exports.postreview= async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
     newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New review Created!");
    res.redirect(`/listing/${listing._id}`)
}
module.exports.deletereview=async (req, res) => {
    let { id, reviewId } = req.params;
    const result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const deleteditem = await Review.findByIdAndDelete(reviewId);
    console.log(deleteditem);
    console.log(result);
    req.flash("success", "Review deleted!");
    res.redirect(`/listing/${id}`);
}