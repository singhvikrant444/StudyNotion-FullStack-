const User= require("..//models/User");
const mailSender=require("..//utils/mailSender");

//---------------------resetPasswordToken--------------------
exports.resetPasswordToken=async(req,res)=>{
    try{
    //get email from req body
    const email=req.body.email;
    //check user for this email,emailvalidation
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:'Your Email is not registered with us'
        });
        }
    //generate token
    const token=crypto.randomUUID();
    //update user by adding token and expiration time
     const updateDetails=await User.findOneAndUpdate(
        {email:email},
        {
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },
        {new:true}
    );
    //create url
    const url=`http://localhost:3000/update-password/${token}`
    //send mail containing the url
     await mailSender(email,
        "Password Reset Link",
        `Password Reset Link:${url}`
     );
    //return response
    return res.json({
        success:true,
        message:'Email sent successfully,Please check email and Change password'
    });

}catch(err){
    return res.status(500).json({
        success:false,
        message:'Something went wrong'
    })
}

}
//---------------------------ResetPassword-----------------
exports.resetPassword=async(req,res)=>{
    try{
    //data fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:'Password not matching'
        })
    }
    //get userdetail from db uing token
    const userDetails=await User.findOne({token:token});
    //if non entry -invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:'Token is Invalid',
        });
    }
    //token time check
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:'Token is expired ,Please regenerate your toekn', 
        });
    }
    //hash password
    const hasedPassword =await bcryt.hash(password,10);
    //password update
    await User.findOneAndUpdate(
        {token:token},
        {password:hasedPassword},
        {new:true,}
    );
    //return reponse
    return res.status(200).json({
        success:true,
        message:'Password reset successful',
    })
}catch(error){
  return res.status(500).json({
        success:false,
        message:'Something went wrong'
    });
}
}