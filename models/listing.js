const mongoose=require("mongoose");
const Review = require("./review");
const schema=mongoose.Schema;

const listingSchema=schema({
    title:{
       type: String,
       require:true,
    },
    description:String,
     image: {
    filename: {
      type: String,
      default: 'default_image'
    },
    url: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg",
      set: (v) => v === "" ? "https://t4.ftcdn.net/jpg/02/56/10/07/360_F_256100731_qNLp6MQ3FjYtA3Freu9epjhsAj2cwU9c.jpg" : v
    }
  },
    price:Number,
    location:String,
    country:String,
    
    reviews:[
      {
        type:schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:schema.Types.ObjectId,
      ref:"User",
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;  