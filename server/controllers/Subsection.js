const Subsection = require('../models/SubSection');

exports.createSubsection = async (req, res) => { 
    try {
        //data fetch
        const {sectionId,title,timeDuration,description}=req.body;
        //validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }
        //upload video to cloudinary
        const video=req.files.video;
        const videoUrl=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const newSubsection=await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update section by pushing subsection id
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                    subsections:newSubsection._id,
                }
            },
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:'Subsection created successfully',
            newSubsection,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}   