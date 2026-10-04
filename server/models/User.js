const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim:true,
    },
    lastName: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ['user', 'admin', 'instructor'],
        default: 'user',
        required: true,
    },
    additionalDetails: { 
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Profile",
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    image:{
        type: String,
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    courseProgress: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress',
    }],
});

module.exports = mongoose.model('User', userSchema);
