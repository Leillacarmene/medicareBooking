import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);


reviewSchema.pre(/^find/, function(next){
  this.populate({
    path:'user',
    select:'name photo',
  });
  next();
})
reviewSchema.statics.calcAverageRatings = async function(doctorId){

  //this point the current review
  const stats = await this.agregate([{
    $match:{doctor:doctorId}
  },
  {
    $group:{
      _id:"$doctor",
      numOfRating:{$sum:1},
      avRating:{$avg:"$rating"},
    },
  },
  ]);
    await Doctor.findByIdAndUpdate(doctorId,{
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avRating
    });
}
reviewSchema.post("save", function(){
  this.constructor.calcAverageRatings(this.doctor)
})
export default mongoose.model("Review", reviewSchema);
