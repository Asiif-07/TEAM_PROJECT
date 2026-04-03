import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  github: {
    type: String,
    required: false
  },

  linkedin: {
    type: String,
    required: false
  },

  summary: {
    type: String,
    required: true
  },

  education: [  
    {
      degree: {
        type: String,
        required: true
      },
      institute: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      }
    }
  ],

  skills: {
    type: [String],
    required: true
  },

  projects: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      githubLink: {
        type: String,
        required: false
      },
      liveLink: {
        type: String,
        required: false // optional
      }
    }
  ],

  experience: [
    {
      role: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  templateId: {
    type:String,
    default:"american-style"
  }

}, { timestamps: true });

const Cv = mongoose.model("Cv", cvSchema);

export default Cv;