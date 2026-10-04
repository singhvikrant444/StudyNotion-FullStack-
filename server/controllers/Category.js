const Category=require("../models/Category");
exports.createCategory=async(req,res)=>{
    try{
        //fetch data
        const{name,description}=req.body;
        //validation
        if(!name || description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create entry in DB
        const tagDetails =await Tag.create({
            name:name,
            description:'Tag Created Successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};
//getALLtags handler function
exports.showAllCategory=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

//category page details handler function
exports.getCategoryDetails=async(req,res)=>{
    try{
        //get category id
        const {categoryId}=req.body;
        //get courses for specified category
        const selectedCategory=await Category.findById(categoryId).populate('courses');
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Category not found',
            })
        }
        //get courses for different categories
        const differentCategory=await Category.find({ _id: { $ne: categoryId } }).populate('courses');
        //get top selling courses
        const topSellingCourses=await Course.find({category:categoryId}).sort({studentsEnrolled:-1}).limit(10);
        //return response
        return res.status(200).json({
            success:true,
            message:'Category details fetched successfully',
            selectedCategory,
            differentCategory,
            topSellingCourses,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};