import { Router } from "express";
import { generateSummary, enhanceExperience } from "../controller/ai.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";

const aiRouter = Router();

aiRouter.use(authMiddleWare);

aiRouter.post("/generate-summary", generateSummary);
aiRouter.post("/enhance-experience", enhanceExperience);

export default aiRouter;
