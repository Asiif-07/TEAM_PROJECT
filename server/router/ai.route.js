import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { generateAIContent } from "../controller/ai.controller.js";
import validate from "../middleWare/validate.js";
import { aiGenSchema } from "../schemas/genAi.schema.js";
import { parseUploadedCV } from "../controller/cv_parser.controller.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";

const aiRouter = Router();

const allowedFileTypes = [
  "application/pdf", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]; 

const uploadMiddleware = imageMulter(5, allowedFileTypes);

aiRouter.route("/upload-and-extract").post(authMiddleWare, uploadMiddleware.single("resume_file"), parseUploadedCV);

// AI Generation Route
aiRouter.route("/ai-generate").post(authMiddleWare, validate(aiGenSchema), generateAIContent);

export default aiRouter;