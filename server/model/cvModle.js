import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: function() {
      return this.status === 'completed';
    }
  },

  phone: {
    type: String,
    required: function() {
      return this.status === 'completed';
    }
  },

  title: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  dob: {
    type: String,
    default: ""
  },

  languages: {
    type: String,
    default: ""
  },

  certifications: {
    type: String,
    default: ""
  },

  github: {
    type: String,
    default: ""
  },

  linkedin: {
    type: String,
    default: ""
  },

  summary: {
    type: String,
    default: ""
  },

  additionalSections: [
    {
      id: { type: String, default: "" },
      title: { type: String, default: "" },
      content: { type: String, default: "" },
    }
  ],

  education: [
    {
      degree: {
        type: String,
        default: ""
      },
      institute: {
        type: String,
        default: ""
      },
      startDate: {
        type: String,
        default: ""
      },
      endDate: {
        type: String,
        default: ""
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        default: ""
      }
    }
  ],

  skills: {
    type: [String],
    default: []
  },

  projects: [
    {
      title: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      githubLink: {
        type: String,
        default: ""
      },
      liveLink: {
        type: String,
        default: ""
      }
    }
  ],

  experience: [
    {
      role: {
        type: String,
        default: ""
      },
      company: {
        type: String,
        default: ""
      },
      startDate: {
        type: String,
        default: ""
      },
      endDate: {
        type: String,
        default: ""
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        default: ""
      }
    }
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  templateId: {
    type: String,
    default: "classic-red"
  },

  templateCategory: {
    type: String,
    default: "saved"
  },

  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },

  lastSavedAt: {
    type: Date,
    default: Date.now
  },

  profileImage: {
    secure_url: { type: String },
    public_id: { type: String }
  }

}, { timestamps: true });

const Cv = mongoose.model("Cv", cvSchema);

export default Cv;