import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    content: {
        type: String, // Rich Text
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    coverImage: {
        secure_url: { type: String, default: "" },
        public_id: { type: String, default: "" },
    },
    bodyImages: [
        {
            secure_url: { type: String },
            public_id: { type: String },
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    reactions: {
        type: Map,
        of: Boolean, // userId: true
        default: {}
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Helper to calculate total reactions
postSchema.virtual('reactionCount').get(function() {
    return this.reactions ? this.reactions.size : 0;
});

const Post = mongoose.model("Post", postSchema);
export default Post;
