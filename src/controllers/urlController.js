import {
  createShortUrl,
  getOriginalUrl,
  incrementClicks
} from "../services/url.service.js";

import { env } from "../config/env.js";

// Create short URL
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (typeof originalUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid HTTP or HTTPS URL"
      });
    }

    const newUrl = await createShortUrl(parsedUrl.href);

    const shortUrl = `${env.BASE_URL}/${newUrl.shortCode}`;

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Redirect short URL
export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await getOriginalUrl(shortCode);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found"
      });
    }

    await incrementClicks(shortCode);

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};