const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt=require("bcrypt");
const jwt=required("jsonwebtoken");
require('dotenv').config();



//------------------send OTP--------------------------
exports.sendOTP =async(req,res)=>{
    try{
        const {email}=req.body;

        //check if user already exist
        const checkUserPresent =await User.findOne({email});

        //if user already exist ,then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated:",otp);

        //check unique otp or not
        let result =await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result=await OTP.findOne({otp:otp});
        }
      const otpPayload={email,otp};

      const  otpBody=await OTP.create(otpPayload);
      console.log(otpBody);

      //return reponse successful
      res.status(200).json({
        success:true,
        message:'OTP sent Successfully',
        otp,
      })
 }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Failed to send OTP',
        });
    }
}

//------------------signUp-----------------------------
exports.signUp= async(req,res)=>{
    //data fetch from request body
    try{
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;

    //validate karlo
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }

    //password match karlo
    if(password !==confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and ConfirmPassword Value does not match,Pease try again'
        })
    }
    // check user already exist or not
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is Already registered'
        });
    }

    //find most recent OTP stored for the User
    const recentOtp=await OTP.find({email}.sort({createdAt:-1}).limit(1));
    cosole.log(recentOtp);

    //validate OTP
    if(recentOtp.length==0){
        //OTP not found
        return res.status(400).json({
            success:false,
            message:'OTP found',
        })
    }else if(otp !==recentOtp.otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        });
    }

    //Hash password
    const hashedPassword =await bcrypt.hash(password,10);

    //entry create in DB
    const profileDetails =await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
    });
    const user =await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://apidicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    //return res
    return res.status(200).json({
        success:true,
        message:'User is registered successfully',
        user,
    });

}
catch(error){
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"User cannot be registered .Please try again",
    })
}
}

//-------------------Login-----------------------
exports.login=async(req,res)=>{
    try{
      const{email,password}=req.body
;
if(!email || !password){
    return res.status(403).json({
        success:false,
        message:'All fields are required,please try again',
    });
}  
    const user=await User.findOne({email}).populate("additional details");
    if(!User){
        return res.status(201).json({
            success:false,
            message:"User is not registered,please signup first",
       
        });
    }
    //generate JWT,after password matching
    if(await bcrypt.compare(password,user.password)){
      const payload={
        email:user.email,
        id:user_id,
        accountType:user.accountType,
      }
      const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h",
      });
      user.token=token;
      user.password=undefined;

      //create cookie and send response
      const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true,
      }
      res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
      })
    }
    else{
        return res.status(401).json({
            success:false,
            message:'Pasword is Incorrect ',
        })
    }
}
    catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:'Login Failure,Please try again'
    })
    }
}

//-------------ChangePassword------------------------
exports.changePassword=async(req,res)=>{
    //get data from req body
    //get oldPassword,new Password,confirmNewPassword
    //validation
    //update pwd in DB
    //send mail--Password updated
    //return response
}