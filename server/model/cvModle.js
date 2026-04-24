import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  // --- ORIGINAL FIELDS ---
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  summary: { type: String, required: true },
  
  // --- NEW BASIC FIELDS (Flattened, No 'basics' wrapper) ---
  label: { type: String, trim: true }, // e.g., "Programmer"
  url: { type: String, trim: true },   // Personal Website
  location: {
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    city: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    region: { type: String, trim: true }
  },

  // --- ORIGINAL ARRAYS ---
  education: [
    {
      degree: { type: String, required: true },
      institute: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date }, 
      isCurrent: { type: Boolean, default: false }
    }
  ],
  skills: { type: [String], required: true },
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      githubLink: { type: String, trim: true },
      liveLink: { type: String, trim: true }
    }
  ],
  experience: [
    {
      role: { type: String, required: true },
      company: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date }, 
      isCurrent: { type: Boolean, default: false },
      description: { type: String, required: true }
    }
  ],

  // --- NEW JSON RESUME ARRAYS ---
  volunteer: [{
    organization: { type: String },
    position: { type: String },
    url: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    summary: { type: String },
    highlights: [{ type: String }]
  }],
  awards: [{
    title: { type: String },
    date: { type: Date },
    awarder: { type: String },
    summary: { type: String }
  }],
  certificates: [{
    name: { type: String },
    date: { type: Date },
    issuer: { type: String },
    url: { type: String }
  }],
  publications: [{
    name: { type: String },
    publisher: { type: String },
    releaseDate: { type: Date },
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

  // --- ORIGINAL RELATIONS & META ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: { type: String, default: "american-style" },
  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  }
}, { timestamps: true });

const Cv = mongoose.model("Cv", cvSchema);

export default Cv;