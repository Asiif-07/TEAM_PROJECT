import { Router } from "express";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { generateAIContent } from "../controller/ai.controller.js";
import validate from "../middleWare/validate.js";
import { aiGenSchema } from "../schemas/genAi.schema.js";

const aiRouter = Router();

aiRouter.route("/ai-generate").post(validate(aiGenSchema), authMiddleWare, generateAIContent)

export default aiRouter;
