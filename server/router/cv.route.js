import { Router } from "express";



import {

    CreateCv,

    updateCv,

    getAllCvs,

    SingleCv,

    deleteCv,
    saveDraft,
    getMyDrafts,
    updateDraft,
    finalizeCV

} from "../controller/cv.controller.js";

import validate from '../middleWare/validate.js'

import { CvSchema, updateCvSchema } from '../schemas/cv.schema.js'

import authMiddleWare from "../middleWare/authMiddleWare.js";

import parseJsonFields from "../middleWare/parserJsonFields.js";

import { imageMulter } from "../middleWare/imageMulter.middleWare.js";



const cvRouter = Router();



cvRouter.use(authMiddleWare)



const uploadProfile = imageMulter(5, ["image/jpeg", "image/png", "image/jpg"])





cvRouter.route("/cv").post(uploadProfile.single("profileImage"), parseJsonFields(["education", "skills", "projects", "experience"]), validate(CvSchema), CreateCv).get(getAllCvs)

cvRouter.route("/cv/:id").put(uploadProfile.single("profileImage"), parseJsonFields(["education", "skills", "projects", "experience"]), validate(updateCvSchema), updateCv).get(SingleCv).delete(deleteCv)

cvRouter.post("/save-draft", saveDraft)
cvRouter.get("/my-drafts", getMyDrafts)
cvRouter.put("/finalize/:id", finalizeCV)
cvRouter.get("/:id", SingleCv)
cvRouter.put("/:id", updateDraft)
cvRouter.delete("/:id", deleteCv)





export default cvRouter