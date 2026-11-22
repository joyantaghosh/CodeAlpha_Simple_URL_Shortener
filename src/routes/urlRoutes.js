import express from "express";
import {validateUrl} from "../middleware/validate.middleware.js";
import {
  shortenUrl,
  redirectUrl
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/shorten",validateUrl, shortenUrl);

router.get("/:shortCode", redirectUrl);

export default router;