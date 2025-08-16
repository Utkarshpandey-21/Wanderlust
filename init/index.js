const initialdata =require("./data.js");
const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const MONGO_URL='mongodb://127.0.0.1:27017/wonderlust';
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initialdata.data= initialdata.data.map((obj)=>({...obj,owner:"68722a0f5c619b7689d34749"}))
    await Listing.insertMany(initialdata.data);
    console.log("data was initialised");
};
 initDB();