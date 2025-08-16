const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");
const User = require("../models/user.js");
const { link } = require("joi");
module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting });
};

module.exports.renderNewform= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
        path:"author",
       },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res, next) => {
        let url=req.file.path;
        let filename=req.file.filename;
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }
        const result = listingSchema.validate(req.body);
        if (result.error) {
          throw new ExpressError(400, result.error);
          
        }
        const newlisting = new Listing(req.body.listing);
        newlisting.owner=req.user._id;
        newlisting.image={filename,url};
        // if(!newlisting.title){
        //      throw new ExpressError(400,"title is missing");
        // }
        //  if(!newlisting.description){
        //      throw new ExpressError(400,"description is missing");
        // }
        //  if(!newlisting.price){
        //      throw new ExpressError(400,"price is missing");
        // }
        //  if(!newlisting.location){
        //      throw new ExpressError(400,"location is missing");
        // }
        //  if(!newlisting.country){
        //      throw new ExpressError(400,"country is missing");
        // }
        await newlisting.save();
        req.flash("success", "New listing Created!");
        res.redirect("/listing");

    }
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}
module.exports.update=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
     let url=req.file.path;
     let filename=req.file.filename;
    listing.image={filename,url};
    await listing.save();
    }
    req.flash("success", "listing Updated!");
    res.redirect(`/listing/${id}`);
}
module.exports.delete=async (req, res) => {
    let { id } = req.params;
    const deleteditem = await Listing.findByIdAndDelete(id);
    console.log(deleteditem);
    req.flash("success", "listing Deleted!");
    res.redirect("/listing");
}