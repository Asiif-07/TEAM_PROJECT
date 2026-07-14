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
        const { userId } = req.params;

        let profile = await BlogProfile.findOne({ user: userId }).populate("user", "name profileImage");

        if (!profile) {
            // Auto-create public blog profile if it doesn't exist yet.
            // This prevents random 404s on deployment when the profile document
            // was never created for some users.
            const User = (await import("../model/user.model.js")).default;
            const user = await User.findById(userId).select("name");

            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            profile = await BlogProfile.create({
                user: userId,
                displayName: user.name || "",
            });

            profile = await BlogProfile.findOne({ user: userId }).populate("user", "name profileImage");
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

