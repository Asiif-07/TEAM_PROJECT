import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  // --- PERSONAL INFO (Mostly Optional for Drafts) ---
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  summary: { type: String },
  label: { type: String, trim: true },
  url: { type: String, trim: true },
  location: {
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    city: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    region: { type: String, trim: true }
  },

  // --- ARRAYS (Strings for Dates to support free typing) ---
  education: [
    {
      degree: { type: String },
      institute: { type: String },
      startDate: { type: String }, // Switched from Date to String
      endDate: { type: String },   // Switched from Date to String
      isCurrent: { type: Boolean, default: false }
    }
  ],
  skills: { type: [String], default: [] },
  projects: [
    {
      title: { type: String },
      description: { type: String },
      githubLink: { type: String, trim: true },
      liveLink: { type: String, trim: true }
    }
  ],
  experience: [
    {
      role: { type: String },
      company: { type: String },
      startDate: { type: String }, // Switched from Date to String
      endDate: { type: String },   // Switched from Date to String
      isCurrent: { type: Boolean, default: false },
      description: { type: String }
    }
  ],

  volunteer: [{
    organization: { type: String },
    position: { type: String },
    url: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    summary: { type: String },
    highlights: [{ type: String }]
  }],
  awards: [{
    title: { type: String },
    date: { type: String },
    awarder: { type: String },
    summary: { type: String }
  }],
  certificates: [{
    name: { type: String },
    date: { type: String },
    issuer: { type: String },
    url: { type: String }
  }],
  publications: [{
    name: { type: String },
    publisher: { type: String },
    releaseDate: { type: String },
    url: { type: String },
    summary: { type: String }
  }],
  languages: [{
    language: { type: String },
    fluency: { type: String }
  }],
  interests: [{
    name: { type: String },
    keywords: [{ type: String }]
  }],
  references: [{
    name: { type: String },
    reference: { type: String }
  }],

  // --- META & RELATIONS ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Keeping only userId as strictly required
  },
  templateId: { type: String, default: "american-style" },
  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  },
  additionalSections: [
    {
      title: { type: String },
      details: { type: String }
    }
  ]
}, { timestamps: true });

const Cv = mongoose.model("Cv", cvSchema);

export default Cv;