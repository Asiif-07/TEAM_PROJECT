import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    password: {
        type: String,
        required: function passwordRequired() {
            return !this.googleId;
        },
        minlength: 6,
        select: false
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    refreshToken: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            _id: false
        }
    ],
    forgetPasswordToken: {
        type: String,
        default: null
    },
    forgetPasswordExpiry: {
        type: Date,
        default: null
    },
    profileImage: {
        secure_url: { type: String, default: "" },
        public_id: { type: String, default: "" },
    },



})

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) {
        return
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);

    }
    catch (error) {
        console.log("failed to hash the password")
    }
})

userSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

const User = mongoose.model("User", userSchema);

export default User;