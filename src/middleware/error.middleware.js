export const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" &&
      (!err.status || err.status >= 500)
        ? "Internal server error"
        : err.message || "Internal server error"
  });
};