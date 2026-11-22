export const validateUrl = (req, res, next) => {
  const { originalUrl } = req.body ?? {};

  if (typeof originalUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "URL is required"
    });
  }

  try {
    const parsedUrl = new URL(originalUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }

    req.originalUrlToShorten = parsedUrl.href;

    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid URL format"
    });
  }
};