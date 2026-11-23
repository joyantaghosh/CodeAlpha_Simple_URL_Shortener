import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";
import urlRoutes from "./routes/urlRoutes.js";
import { notFound } from "./middleware/notfound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();


// Security headers
app.use(helmet());

// Allow configured frontend
app.use(cors({
  origin: env.FRONTEND_URL
}));

// Request logging
app.use(morgan(
  env.NODE_ENV === "production" ? "combined" : "dev"
));


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