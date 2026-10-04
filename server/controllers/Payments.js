const {instance: razorpayInstance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mailTemplates/courseEnrollmentEmail');
const { PassThrough } = require('nodemailer/lib/xoauth2');

//caputure payment and initiate the Razorpay order
exports.capturePayment=async(req,res)=>{
    try {
        //get courseId and userId
        const {courseId}=req.body;
        const userId=req.user.id;
        //validation
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:'CourseId is required',
            })
        }
        //get course details
        const courseDetails=await Course
        .findById(courseId)
        .populate('instructor','firstName lastName email');
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Course not found',
            })
        }
    }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    

        //get user details
        const userDetails=await User.findById(User);
        //create order on Razorpay
        const amount=userDetails.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
        }
        try {
            //initiate order
            const order=await instance.orders.create(options);
            return res.status(200).json({
                success:true,
                order,
                courseName:Course.courseName,
                courseDescription:Course.courseDescription,
                thumbnail:Course.thumbnail,
                orderId:PaymentResponse.id,
                currency:PaymentResponse.currency,
                amount:PaymentResponse.amount,

                userDetails,
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }
//verify Signature of Razorpay order and  server response
exports.verifySignature=async(req,res)=>{

        const webhookSecret="12345678";
        const signature=req.headers['x-razorpay-signature'];
        const shasum=crypto.createHmac('sha256',webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest=shasum.digest('hex');
        if(signature===digest){
            console.log('Payment is legit');
            //fulfill the order
            const {courseId,userId}=req.body.payload.payment.entity.notes;
        try{
           const enrolledCourse=await User.findOneAndUpdate(
                {_id:courseId},
                {$push:{enrolledCourses:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(404).json({
                    success:false,
                    message:'Course not found',
                });
            }
            //find the student and add the course to their enrolled courses
            const enrolledstudent=await User.findOneAndUpdate(
                {_id:userId},
                {$push:{enrolledCourses:courseId}},
                {new:true},
            );

            //send email to student about course enrollment
            const emailResponse=await mailSender(
                enrolledstudent.email,
                courseEnrollmentEmail(enrolledstudent.firstName,courseDetails.courseName),
                ' Congratulations on enrolling in a new course!',
            );
            console.log('Email sent successfully',emailResponse);
            return res.status(200).json({
                success:true,
                message:'Payment verified and course enrolled successfully',
            });
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }else{
        console.log('Payment is not legit');
        return res.status(400).json({
            success:false,
            message:'Invalid payment',
        });
    }
} 
