import AsyncHandler from '../handler/AsyncHandler.js'
import Cv from '../model/cvModle.js'
import CustomError from '../handler/CustomError.js'
import User from '../model/user.model.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

const CreateCv = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const {
        name, email, phone, github, linkedin, summary, education, skills, projects, experience, templateId,
        // NEW FIELDS
        label, url, location, volunteer, awards, certificates, publications, languages, interests, references
    } = req.body;

    const findId = await User.findById(userId);

    if (!findId) {
        throw new CustomError(404, 'User not found');
    }

    let profileImage;
    if (req.file) {
        const result = await uploadToCloudinary(
            {
                resource_type: "image",
                public_id: `profile_${Date.now()}`
            },
           req.file.buffer
        );
        profileImage = result.secure_url;
    }

    const formattedEducation = education?.map(edu => ({
        ...edu,
        endDate: edu.isCurrent || !edu.endDate || edu.endDate === "" ? null : edu.endDate,
        startDate: !edu.startDate || edu.startDate === "" ? null : edu.startDate
    }));

    const formattedExperience = experience?.map(exp => ({
        ...exp,
        endDate: exp.isCurrent || !exp.endDate || exp.endDate === "" ? null : exp.endDate,
        startDate: !exp.startDate || exp.startDate === "" ? null : exp.startDate
    }));

    const cv = await Cv.create({
        userId,
        name, email, phone, github, linkedin, summary,
        education: formattedEducation,
        skills,
        projects,
        experience: formattedExperience,
        profileImage,
        templateId,
        // NEW FIELDS
        label, url, location, volunteer, awards, certificates, publications, languages, interests, references
    });

    res.status(201).json({
        success: true,
        message: 'CV created successfully',
        data: cv
    });
});

const updateCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;
    
    // req.body will automatically contain any of the new optional fields sent from the frontend
    const updateData = { ...req.body };

    const findCv = await Cv.findById(id);

    if (!findCv) {
        throw new CustomError(404, "cv not found");
    }

    if (findCv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, "Not authorized to update this CV");
    }

    if (req.file) {
        const result = await uploadToCloudinary(
            {
                resource_type: "image",
                public_id: `profile_${Date.now()}`
            },
            req.file.buffer
        );
        updateData.profileImage = result.secure_url;
    }

    const updatedCv = await Cv.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
        success: true,
        message: 'CV updated successfully',
        data: updatedCv
    });
});

const getAllCvs = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const cvs = await Cv.find({ userId })

    if (cvs.length === 0) {
        throw new CustomError(404, 'CVs not found')
    }

    res.status(200).json({
        success: true,
        message: 'CVs fetched successfully',
        data: cvs
    })
})

const SingleCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const findCv = await Cv.findById(id)

    if (!findCv) {
        throw new CustomError(404, "cv not found")
    }

    if (findCv.userId.toString() !== req.userId.toString()) {
        throw new CustomError(403, "Not authorized to view this CV")
    }

    res.status(200).json({
        success: true,
        message: 'CV fetched successfully',
        data: findCv
    })
})

const deleteCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const findId = await Cv.findById(id)

    if (!findId) {
        throw new CustomError(404, "Cv not found")
    }

    if (findId.userId.toString() !== req.userId.toString()) {
        throw new CustomError(403, "Not authorized to delete this CV")
    }

    await Cv.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: 'CV deleted successfully'
    })
})

export { CreateCv, updateCv, getAllCvs, SingleCv, deleteCv }