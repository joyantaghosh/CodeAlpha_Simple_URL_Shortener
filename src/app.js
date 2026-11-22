import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notfound.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to the URL Shortener API",
    version: "1.0.0"});
});

// Unknown routes
app.use(notFound);
// Global error handler (always last)
app.use(errorHandler);

export default app;