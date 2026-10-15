import mongoose from "mongoose";
import Post from "../model/post.model.js";
import Comment from "../model/comment.model.js";
import Category from "../model/category.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { createNotification } from "./notification_controller.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-');      // Replace multiple - with single -
};

export const getPosts = async (req, res) => {
    try {
        const { category, search, author, page = 1, limit = 10 } = req.query;
        const query = {};

        if (category && category !== "All") query.category = category;
        if (author) query.author = author;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const posts = await Post.find(query)
            .populate({
                path: "author",
                select: "name profileImage",
                populate: { path: "blogProfile" }
            })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        const postsWithEngagement = posts.map(post => {
            const postObj = post.toJSON();
            return {
                ...postObj,
                likes: Array.from(post.reactions?.keys() || []),
                likeCount: post.reactions?.size || 0
            };
        });

        res.status(200).json({
            posts: postsWithEngagement,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate({
                path: "author",
                select: "name profileImage",
                populate: { path: "blogProfile" }
            })
            .exec();

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Increment views only once per logged-in account
        // (prevents view inflation when user navigates back/again)
        // Views are only counted when the viewer is authenticated.
        // If you need views for guests too, we can extend this with a cookie/visitorId.
        // If authenticated user comes again, do not increment.
        // Note: viewedBy is a Mongoose Map, so `has` should work after load.
        if (req.user?._id) {
            const userId = req.user._id.toString();

            // Ensure viewedBy exists (older docs might not have it)
            if (!post.viewedBy) post.viewedBy = new Map();

            if (!post.viewedBy.has(userId)) {
                post.viewedBy.set(userId, true);
                post.views += 1;
                await post.save();
            }
        }


        const postObj = post.toJSON();
        const response = {
            ...postObj,
            likes: Array.from(post.reactions?.keys() || []),
            likeCount: post.reactions?.size || 0
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const author = req.user._id;

        let coverImage = {};
        if (req.files && req.files.coverImage) {
            const result = await uploadToCloudinary({
                buffer: req.files.coverImage[0].buffer,
                folder: "blog/covers"
            });
            coverImage = { secure_url: result.secure_url, public_id: result.public_id };
        }

        const bodyImages = [];
        if (req.files && req.files.bodyImages) {
            for (const file of req.files.bodyImages) {
                const result = await uploadToCloudinary({
                    buffer: file.buffer,
                    folder: "blog/body"
                });
                bodyImages.push({ secure_url: result.secure_url, public_id: result.public_id });
            }
        }

        const slug = slugify(title) + "-" + Date.now();

        const newPost = await Post.create({
            title,
            slug,
            content,
            author,
            category,
            coverImage,
            bodyImages
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user._id.toString();

        if (post.reactions.has(userId)) {
            post.reactions.delete(userId);
        } else {
            post.reactions.set(userId, true);
            
            // Notify the post author
            await createNotification({
                recipient: post.author,
                sender: userId,
                type: "like",
                post: post._id
            });
        }

        await post.save();
        res.status(200).json({ 
            likes: Array.from(post.reactions.keys()),
            likeCount: post.reactions.size 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const MAX_COMMENT_LENGTH = 1000;

export const addComment = async (req, res) => {
    try {
        const { parentCommentId } = req.body;
        const postId = req.params.postId;
        const author = req.user._id;
        const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" });
        }
        if (!content) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }
        if (content.length > MAX_COMMENT_LENGTH) {
            return res.status(400).json({
                success: false,
                message: `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer`
            });
        }
        if (parentCommentId && !mongoose.isValidObjectId(parentCommentId)) {
            return res.status(400).json({ success: false, message: "Invalid parent comment id" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Threads are two levels deep: a reply to a reply is attached to the thread's root
        // comment so that it is always returned by getComments (which populates one level).
        let parent = null;
        let threadRootId = null;
        if (parentCommentId) {
            parent = await Comment.findById(parentCommentId);
            if (!parent || parent.post.toString() !== postId.toString()) {
                return res.status(404).json({ success: false, message: "Parent comment not found" });
            }
            threadRootId = parent.parentComment || parent._id;
        }

        const comment = await Comment.create({
            content,
            author,
            post: postId,
            parentComment: threadRootId
        });

        if (threadRootId) {
            await Comment.findByIdAndUpdate(threadRootId, { $push: { replies: comment._id } });
            // Notify the author of the comment being replied to
            await createNotification({
                recipient: parent.author,
                sender: author,
                type: "reply",
                post: postId,
                comment: comment._id
            });
        } else {
            // Top-level comment — notify the post author
            await createNotification({
                recipient: post.author,
                sender: author,
                type: "reply",
                post: postId,
                comment: comment._id
            });
        }

        const populatedComment = await Comment.findById(comment._id).populate("author", "name profileImage");

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("addComment failed:", error);
        res.status(500).json({ success: false, message: "Could not post your comment. Please try again." });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (title) {
            post.title = title;
            // Optionally update slug if needed, but usually better to keep it
        }
        if (content) post.content = content;
        if (category) post.category = category;

        if (req.files && req.files.coverImage) {
            // Delete old cover image logic can be added here
            const result = await uploadToCloudinary({
                buffer: req.files.coverImage[0].buffer,
                folder: "blog/covers"
            });
            post.coverImage = { secure_url: result.secure_url, public_id: result.public_id };
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete from DB (Cloudinary deletion can be added here)
        await Post.findByIdAndDelete(req.params.id);
        
        // Also delete comments
        await Comment.deleteMany({ post: req.params.id });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" });
        }

        const comments = await Comment.find({ post: req.params.postId, parentComment: null })
            .populate("author", "name profileImage")
            .populate({
                path: "replies",
                populate: { path: "author", select: "name profileImage" }
            })
            .sort({ createdAt: -1 });

        // Show replies oldest-first so conversations read naturally
        const result = comments.map((c) => {
            const obj = c.toObject();
            obj.replies = (obj.replies || [])
                .filter(Boolean)
                .sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt));
            return obj;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("getComments failed:", error);
        res.status(500).json({ success: false, message: "Could not load comments. Please try again." });
    }
};

export const deleteComment = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.commentId) || !mongoose.isValidObjectId(req.params.postId)) {
            return res.status(400).json({ success: false, message: "Invalid id" });
        }

        const comment = await Comment.findById(req.params.commentId);
        if (!comment || comment.post.toString() !== req.params.postId.toString()) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Only author can delete
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Also remove from parent's replies if it's a child
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }

        // Delete all child replies too
        if (comment.replies?.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
