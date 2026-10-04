const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//-------------auth------------
exports.auth=async (req,res,next)=>{
    try{
        //extract token
        const token=req.cookies.token
                    ||req.body.token
                    ||req.head("Authorisation").replace("Bearer","");
// if token missing ,then return response
if(!token){
    return res.status(500).json({
        success:false,
        message:'Token is missing',
    });
}

//verify the token
try{
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode);
    req.user=decode;
}
catch(err){
    return res.status(401).json({
        success:false,
        message:'token is invalid'
    })
}
next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//-----------------isStudent---------------------------
exports.isStudent= async (req,res,next) => {
    try{
     if(req.user.accountType !=="Student"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Student Only'
        })

     }
     next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'Error while checking for student'
        });
    }
}

//-----------------isInstructor----------------------------
exports.isStudent= async (req,res,next) => {
    try{
     if(req.user.accountType !=="Instructor"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Instructor Only'
        })

     }
     next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'Error while checking for student'
        });
    }
}

//------------------------isAdmin--------------------------------
exports.isStudent= async (req,res,next) => {
    try{
     if(req.user.accountType !=="Admin"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Admin Only'
        })

     }
     next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'Error while checking for student'
        });
    }
}
