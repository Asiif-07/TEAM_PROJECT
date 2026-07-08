import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../model/category.model.js";

dotenv.config();

const CATEGORIES = [
    { name: "Career Growth", slug: "career-growth", icon: "🚀" },
    { name: "Resume & CV Tips", slug: "resume-cv-tips", icon: "📄" },
    { name: "Job Search", slug: "job-search", icon: "🔍" },
    { name: "Interview Prep", slug: "interview-prep", icon: "🎯" },
    { name: "Education & Skills", slug: "education-skills", icon: "🎓" },
    { name: "Workplace Trends", slug: "workplace-trends", icon: "📊" },
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to DB");

        for (const cat of CATEGORIES) {
            await Category.findOneAndUpdate(
                { slug: cat.slug },
                cat,
                { upsert: true, returnDocument: 'after' }
            );
        }

        console.log(`✅ Seeded ${CATEGORIES.length} categories`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        process.exit(1);
    }
}

seedCategories();
