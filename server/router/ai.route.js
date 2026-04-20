import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { generateAIContent } from "../controller/ai.controller.js";
import validate from "../middleWare/validate.js";
import { aiGenSchema } from "../schemas/genAi.schema.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";
import { parseUploadedCV } from "../controller/cv_parser.controller.js";

const aiRouter = Router();



const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const uploadMiddleware = imageMulter(5, allowedFileTypes);


aiRouter.route("/upload-and-extract").post(authMiddleWare, uploadMiddleware.single("resumeFile"), parseUploadedCV);


aiRouter.route("/ai-generate").post(validate(aiGenSchema), authMiddleWare, generateAIContent)

export default aiRouter;
