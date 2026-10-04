const Profile=require("../models/Profile");

exports.createProfile=async(req,res)=>{
    try {
        //get data
        const {dateofBirth="",about="",contactNumber="",gender=""}=req.body;
        //get userId
        const id=req.user.id;
        //validation
        if(!dateofBirth || !about || !contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }
        //find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        //update profile
        prodileDetails.dateofBirth=dateofBirth;
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile created successfully',
            profileDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }   
};
//---------------------Delete profile-----------------
exports.deleteAccount=async(req,res)=>{
    try{
        //get userId
        const id=req.user.id;
        validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:'User not found',
            })
        }
        //delete profile
        const profileId=({_id:userDetails.additionalDetails});
        await Profile.findByIdAndDelete(profileId);
        //delete user
        await User.findByIdAndDelete(id);
        //return response
        return res.status(200).json({
            success:true,
            message:'Account deleted successfully',
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
//---------------------getAllUserDetails-----------------
exports.getAllUserDetails=async(req,res)=>{
    try{
        const UserDetails=await User.find({}).populate('additionalDetails').exec();
        return res.status(200).json({
            success:true,
            message:'All user details returned successfully',
            UserDetails,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
