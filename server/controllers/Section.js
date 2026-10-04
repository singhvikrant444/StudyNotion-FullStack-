const Section =require("../models/Section");
const Course =require("../models/Course");

exports.createSection=async(requestAnimationFrame,res)=>{
    try{
        //data fetch
        const{sectionName,courseId}=req.body;
        //validation
        if(!sectionName || !courseId){ 
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }   
        //create course
        const newSection=await Section.create({
            sectionName,
            courseId,
        });
        //update course by pushing section id
        await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push:{
                    sections:newSection._id,
                }
            },
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',     
            newSection,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
//---------------------------update section-----------------
exports.updateSection=async(req,res)=>{
    try{
    //data fetch
    const{sectionId,sectionName}=req.body;
    //validation
    if(!sectionId || !sectionName){
        return res.status(400).json({
            success:false,
            message:'All fields are required',
        })
    }
    //update section
    const updatedSection=await Section.findByIdAndUpdate(
        {_id:sectionId},
        {sectionName:sectionName},
        {new:true});

    //return response
    return res.status(200).json({
        success:true,
        message:'Section updated successfully',
        updatedSection,
    })
}catch(error){
    return res.status(500).json({
        success:false,
        message:error.message,
    })
}   
}
//---------------------------delete section-----------------
exports.deleteSection=async(req,res)=>{
    try{    
    //data fetch
    const{sectionId}=req.body;
    //validation
    if(!sectionId){
        return res.status(400).json({
            success:false,
            message:'Section Id is required',
        })
    }
    //delete section
    await Section.findByIdAndDelete({_id:sectionId});

    //return response
    return res.status(200).json({
        success:true,
        message:'Section deleted successfully',
    })
}catch(error){
    return res.status(500).json({
        success:false,
        message:error.message,
    })
}   
}