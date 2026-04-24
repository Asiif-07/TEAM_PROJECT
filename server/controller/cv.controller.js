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

    const updatedCv = await Cv.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

    res.status(200).json({
        success: true,
        message: 'CV updated successfully',
        data: updatedCv
    });
});

const getAllCvs = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const cvs = await Cv.find({ userId })

    res.status(200).json({
        success: true,
        message: cvs.length === 0 ? 'No CVs found' : 'CVs fetched successfully',
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

const buildDraftPayload = (body = {}, userId) => ({
    userId,
    name: body?.name || "Untitled Draft",
    email: body?.email || "",
    phone: body?.phone || "",
    title: body?.title || "",
    address: body?.address || "",
    dob: body?.dob || "",
    github: body?.github || "",
    linkedin: body?.linkedin || "",
    summary: body?.summary || "",
    education: Array.isArray(body?.education) ? body.education : [],
    skills: Array.isArray(body?.skills) ? body.skills : [],
    projects: Array.isArray(body?.projects) ? body.projects : [],
    experience: Array.isArray(body?.experience) ? body.experience : [],
    languages: body?.languages || "",
    certifications: body?.certifications || "",
    additionalSections: Array.isArray(body?.additionalSections) ? body.additionalSections : [],
    templateId: body?.templateId || body?.template || "classic-red",
    templateCategory: body?.templateCategory || "saved",
    status: body?.status === "completed" ? "completed" : "draft",
    lastSavedAt: new Date(),
});

// Save CV as Draft (create or update if draftId/id provided)
const saveDraft = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { draftId, id } = req.body || {};
    const targetId = draftId || id;
    const payload = buildDraftPayload(req.body, userId);
    payload.status = "draft";

    let cv;
    if (targetId) {
        const existing = await Cv.findById(targetId);
        if (!existing) throw new CustomError(404, "Draft not found");
        if (existing.userId.toString() !== userId.toString()) {
            throw new CustomError(403, "Not authorized to update this draft");
        }
        cv = await Cv.findByIdAndUpdate(targetId, payload, { returnDocument: 'after', runValidators: true });
    } else {
        cv = await Cv.create(payload);
    }

    res.status(201).json({
        success: true,
        message: targetId ? "Draft updated successfully" : "Draft saved successfully",
        data: cv
    });
});

// Get user's drafts only
const getMyDrafts = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const drafts = await Cv.find({ userId, status: 'draft' })
        .sort({ lastSavedAt: -1 });

    res.status(200).json({
        success: true,
        message: drafts.length === 0 ? 'No drafts found' : 'Drafts fetched successfully',
        data: drafts
    });
});

// Update existing draft
const updateDraft = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = buildDraftPayload(req.body, userId);
    updateData.status = "draft";

    const findCv = await Cv.findById(id);

    if (!findCv) {
        throw new CustomError(404, "Draft not found");
    }

    if (findCv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, "Not authorized to update this draft");
    }

    if (findCv.status !== 'draft') {
        throw new CustomError(400, "Cannot update - CV is already finalized");
    }

    const updatedCv = await Cv.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });

    res.status(200).json({
        success: true,
        message: 'Draft updated successfully',
        data: updatedCv
    });
});

// Finalize draft to completed CV
const finalizeCV = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;

    const findCv = await Cv.findById(id);

    if (!findCv) {
        throw new CustomError(404, "CV not found");
    }

    if (findCv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, "Not authorized to finalize this CV");
    }

    // Validate required fields for completion
    if (!findCv.email || !findCv.phone || !findCv.summary) {
        throw new CustomError(400, "Please fill all required fields before finalizing");
    }

    const finalizedCv = await Cv.findByIdAndUpdate(id, { status: 'completed', lastSavedAt: new Date() }, { returnDocument: 'after' });

    res.status(200).json({
        success: true,
        message: 'CV finalized successfully',
        data: finalizedCv
    });
});

export { CreateCv, updateCv, getAllCvs, SingleCv, deleteCv, saveDraft, getMyDrafts, updateDraft, finalizeCV }