import { Router } from "express";
import { CreateCv, updateCv, getAllCvs,SingleCv,deleteCv } from "../controller/cv.controller.js";
import  validate  from '../middleWare/validate.js'
import  {CvSchema,updateCvSchema} from '../schemas/cv.schema.js'
import authMiddleWare from "../middleWare/authMiddleWare.js";

const cvRouter = Router();

cvRouter.use(authMiddleWare)

cvRouter.route("/cv").post(validate(CvSchema), CreateCv).get(getAllCvs)
cvRouter.route("/cv/:id").put(validate(updateCvSchema) , updateCv).get(SingleCv).delete(deleteCv)


export default cvRouter