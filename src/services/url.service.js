import { nanoid } from "nanoid";
import prisma from "../db/prisma.js";

export const createShortUrl = async (originalUrl) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const shortCode = nanoid(7);

    try {
      return await prisma.url.create({
        data: {
          originalUrl,
          shortCode
        }
      });
    } catch (error) {
      // Retry only on a unique-constraint collision
      if (error.code === "P2002") {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to generate unique short code");
};

export const getOriginalUrl = async (shortCode) => {
  return prisma.url.findUnique({
    where: { shortCode }
  });
};

export const incrementClicks = async (shortCode) => {
  return prisma.url.update({
    where: { shortCode },
    data: {
      clicks: { increment: 1 }
    }
  });
};