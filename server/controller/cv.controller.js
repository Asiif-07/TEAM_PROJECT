import AsyncHandler from '../handler/AsyncHandler.js'
import Cv from '../model/cvModle.js'
import CustomError from '../handler/CustomError.js'
import User from '../model/user.model.js';


const CreateCv = AsyncHandler(async (req, res, next) => {

    const userId = req.userId;

    const { 
      name, email, phone, github, linkedin, 
      summary, education, skills, projects, experience,templateId
    } = req.body;

    const findId = await User.findById(userId)

    if(!findId){
        throw new CustomError(404, 'User not found')
    }

    const newCv = await Cv.create({
      name,
      email,
      phone,
      github,
      linkedin,
      summary,
      education,
      skills,
      projects,
      experience,
      userId,
      templateId
    })

    if(!newCv){
        throw new CustomError(500, 'Failed to create CV')
    }

    res.status(201).json({
        success: true,
        message: 'CV created successfully',
        data: newCv
    })

    

    
})


const updateCv = AsyncHandler(async(req,res,next)=>{

    const {id} = req.params;
    const userId = req.userId;

    //db check
    const findCv = await Cv.findById(id)

    if(!findCv){
        throw new CustomError(404, 'CV not found')
    }   

    //check if the user is the owner of the cv
    if(findCv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, 'Not authorized to update this CV')
    }

    const { 
      name, email, phone, github, linkedin, 
      summary, education, skills, projects, experience, templateId
    } = req.body;


    const updatedFields ={};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
    if (github) updatedFields.github = github;
    if (linkedin) updatedFields.linkedin = linkedin;
    if (summary) updatedFields.summary = summary;
    if (education) updatedFields.education = education;
    if (skills) updatedFields.skills = skills;
    if (projects) updatedFields.projects = projects;
    if (experience) updatedFields.experience = experience;
    if (templateId) updatedFields.templateId = templateId;

    const updateCvFields = await Cv.findByIdAndUpdate(id, {$set: updatedFields}, {new: true})

    if(!updateCvFields){
        throw new CustomError(500, 'Failed to update CV')
    }

    console.log(updateCvFields)

    res.status(200).json({
        success: true,
        message: 'CV updated successfully',
        data: updateCvFields
    })




    
})

const getAllCvs = AsyncHandler(async(req,res,next)=>{

    const userId = req.userId;

    const cvs = await Cv.find({userId})

    console.log(cvs);
    

    if(cvs.length === 0){
        throw new CustomError(404, 'CVs not found')
    }

    res.status(200).json({
        success: true,
        message: 'CVs fetched successfully',
        data: cvs
    })
    
})

const SingleCv = AsyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const findCv = await Cv.findById(id)

    if(!findCv){
        throw new CustomError(404, "cv not found")
    }

    if(findCv.userId.toString() !== req.userId.toString()){
        throw new CustomError(403, "Not authorized to view this CV")
    }

    res.status(200).json({
        success: true,
        message: 'CV fetched successfully',
        data: findCv
    })
})

const deleteCv = AsyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    console.log(id)

    const findId = await Cv.findById(id)

    console.log(findId)

    if(!findId){
        throw new CustomError(404, "Cv not found")
    }

    if(findId.userId.toString() !== req.userId.toString()){
        throw new CustomError(403, "Not authorized to delete this CV")
    }

    await Cv.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: 'CV deleted successfully'
    })

    
})

export { CreateCv, updateCv, getAllCvs, SingleCv, deleteCv }