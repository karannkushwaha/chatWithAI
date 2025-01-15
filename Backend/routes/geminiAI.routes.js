import { Router } from "express";
import * as aiController from "../controller/geminiAI.controller.js";
const router = Router();

router.get("/getResult", aiController.getResult);

export default router;
