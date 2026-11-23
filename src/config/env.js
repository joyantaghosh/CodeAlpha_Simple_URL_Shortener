import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BASE_URL: z.url(),
  PORT: z.coerce.number().int().min(1).max(65535)
    .default(5000),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]).default("development")
});
export const env = envSchema.parse(process.env);