import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
export const updateDoctor =async(req,res) => {
    const id = req.params.id
    try{
        const updateDoctor = await Doctor.findByIdAndUpdate(
            id, 
            {$set:req.body},
            {new:true})
        res.status(200).json({succes:true,message:'successfull updated', data:updateDoctor})
    } catch(err) {
        res.status(500).json({succes:false,message:'Failed to update'})
    }
};
export const deleteDoctor = async(req,res) =>{
    const id = req.params.id;
    try{
         await Doctor.findByIdAndDelete(id, {$set:req.body},{new:true})
        res.status(200).json({succes:true,message:'successfull deleted'})
    } catch(err) {
        res.status(500).json({succes:false,message:'Failed to delete'})
    }
};
export const getSingleDoctor =async(req,res) =>{
    const id = req.params.id
    try{
        const doctor = await Doctor.findById(id).populate('reviews').select('-password');
        res.status(200).json({succes:true,message:'User Found', data:doctor})
    } catch(err) {
        res.status(404).json({succes:false,message:'No user found'})
    }
};
export const getAllDoctor =async(req,res) =>{

    
    try {
        const { query } = req.quer
        let doctors;
        if (query) {  
        doctors = await Doctor.find 
    ({ 
    isApproved:'approved', 
    $or: [  
   {name: {$regex:query,$options:'i'}},
    {specialization: {$regex:query,$options:'i'}}
     ],

 }).select('-password');  }else{  
 doctors = await Doctor.find({isApproved:'approved'}).select('-password');
                                                   }   
        res.status(200).json({succes:true,message:'Users Found', data:doctors, 
    });
    } catch(err) { 
        res.status(404).json({succes:false,message:'Not found'}) 
    }
};

export const getDoctorProfile = async (req, res) =>
{
    const doctorId = req.userId;
    try{
        const doctor = await Doctor.findById(doctorId)

        if(!doctor){
        return res.status(404).json({success:false,message:'Doctor not found'})
    }
        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({doctor:doctorId})
        res
            .status(200).json({
                success: true,
                message: 'profile info is getting',
                data: { ...rest, appointments },
            })

    }catch(err){
        res.status(500).json({ succes: false, message: 'something went wrong,cannot get' });
    }  
}