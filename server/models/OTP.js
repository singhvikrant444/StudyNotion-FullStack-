const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires after 5 minutes (300 seconds)
    },
   
});

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse=await mailSender(email,"Verification OTP",`Your OTP for email verification is: ${otp}`);
        console.log('Verification email sent:', mailResponse);

    }
    catch(error){
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');   
    }
    };

    OTP.pre("save", async function(next){
        if(this.isNew){
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP   
            this.otp = otp;
            await sendVerificationEmail(this.email, otp);
        }
        next();
    });
       
 
module.exports = mongoose.model('OTP', OTPSchema);
