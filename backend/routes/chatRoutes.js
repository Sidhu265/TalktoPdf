import express from "express";
import { chatController,  pdfController, upload } from "../controllers/chatControllers.js"; // Ensure the .js extension
const router = express.Router();

router.post("/chat",chatController);
router.post('/pdf', upload.single('pdfFile'), pdfController);

export { router as pdfchatRoutes };