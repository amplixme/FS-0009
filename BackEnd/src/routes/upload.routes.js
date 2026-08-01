import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
import { upload } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", authMiddleware, uploadImage.single("image"), upload);

export default router;
