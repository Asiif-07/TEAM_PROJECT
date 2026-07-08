import mongoose from "mongoose";

const blogProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        trim: true,
        default: ""
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 280,
        default: ""
    },
    avatar: {
        secure_url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" }
    }
}, { timestamps: true });

const BlogProfile = mongoose.model("BlogProfile", blogProfileSchema);
export default BlogProfile;
