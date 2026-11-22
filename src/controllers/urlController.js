import { nanoid } from "nanoid";
import prisma from "../db/prisma.js";

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

    // Generate unique code
    let shortCode;
    let existingUrl;

    do {
      shortCode = nanoid(7);

      existingUrl = await prisma.url.findUnique({
        where: { shortCode }
      });
    } while (existingUrl);

    // Save URL to database
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: parsedUrl.href,
        shortCode
      }
    });

    const shortUrl =
      `${process.env.BASE_URL}/${newUrl.shortCode}`;

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

    const url = await prisma.url.findUnique({
      where: { shortCode }
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found"
      });
    }

    // Update click count
    await prisma.url.update({
      where: { shortCode },
      data: {
        clicks: {
          increment: 1
        }
      }
    });

    return res.redirect(302, url.originalUrl);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};