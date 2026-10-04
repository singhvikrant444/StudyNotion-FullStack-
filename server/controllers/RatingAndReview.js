const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

exports.createRatingAndReview = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        //fetchdata from request body
        const{rating,review,courseId}=req.body;
        //check if user is enrolled or not
        const courseDetails=await Course.findById(courseId);
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Course not found',
            });
        }
        const isEnrolled=courseDetails.studentsEnrolled.includes(userId);
        if(!isEnrolled){
            return res.status(403).json({
                success:false,
                message:'Only enrolled students can add rating and review',
            });
        }
        //check if user has already added review or not
        const alreadyAdded=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyAdded){
            return res.status(400).json({
                success:false,
                message:'You have already added review for this course',
            });
        }   
        //create rating and review
        const ratingAndReview=await RatingAndReview.create({
            rating,
            review,
            user:userId,
            course:courseId,
        });
        //add rating and review to course
        courseDetails.ratingAndReviews.push(ratingAndReview._id);
        await courseDetails.save();
        return res.status(200).json({
            success:true,
            message:'Rating and review added successfully',
            data:ratingAndReview,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot add rating and review',
            error:error.message,
        });
    }   
}; 

// get average rating and all reviews for a course
exports.getRatingAndReview=async(req,res)=>{
    try{
        //get course id
        const {courseId}=req.body.courseId;
       //calculate average rating
         const result=await RatingAndReview.aggregate([
            {
                $match:{course:mongoose.Types.ObjectId(courseId)},
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:'$rating'},
                }
            },
        ]);
        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:'Rating and review fetched successfully',
                averageRating:result[0].averageRating,
            });
        }else{
            return res.status(200).json({
                success:true,
                message:'Rating and review fetched successfully',
                averageRating:0,
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot fetch rating and review',
            error:error.message,
        });
    }   
};
// get all reviews for a course
exports.getAllRating=async(req,res)=>{
    try{
        //get course id
        const {courseId}=req.body.courseId;
        const allReviews=await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email",
        })
        .populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:'All reviews fetched successfully',
            data:allReviews,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({   
            success:false,
            message:'Cannot fetch all reviews',
            error:error.message,
        }); 
    }
};



