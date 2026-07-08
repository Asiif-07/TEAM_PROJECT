import BlogProfile from "../model/blogProfile.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// GET /api/v1/user/blog-profile
export const getBlogProfile = async (req, res) => {
    try {
        let profile = await BlogProfile.findOne({ user: req.user._id });
        if (!profile) {
            // Auto-create with defaults from User
            profile = await BlogProfile.create({
                user: req.user._id,
                displayName: req.user.name || "",
            });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/v1/user/blog-profile
export const updateBlogProfile = async (req, res) => {
    try {
        const { displayName, bio, github, linkedin, website } = req.body;
        const updateData = {};

        if (displayName !== undefined) updateData.displayName = displayName;
        if (bio !== undefined) updateData.bio = bio;
        if (github !== undefined) updateData["socialLinks.github"] = github;
        if (linkedin !== undefined) updateData["socialLinks.linkedin"] = linkedin;
        if (website !== undefined) updateData["socialLinks.website"] = website;

        // Handle avatar upload
        if (req.file) {
            const result = await uploadToCloudinary({
                buffer: req.file.buffer,
                folder: "blog/avatars"
            });
            updateData.avatar = { secure_url: result.secure_url, public_id: result.public_id };
        }

        const profile = await BlogProfile.findOneAndUpdate(
            { user: req.user._id },
            { $set: updateData },
            { returnDocument: 'after', upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/v1/user/blog-profile/:userId
export const getPublicBlogProfile = async (req, res) => {
    try {
        const profile = await BlogProfile.findOne({ user: req.params.userId }).populate("user", "name profileImage");
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
