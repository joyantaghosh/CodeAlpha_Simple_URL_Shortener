import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../services/url.service.js", () => ({
  createShortUrl: vi.fn(),
  getOriginalUrl: vi.fn(),
  incrementClicks: vi.fn()
}));

import app from "../app.js";

import {
  createShortUrl,
  getOriginalUrl,
  incrementClicks
} from "../services/url.service.js";

describe("URL Shortener API", () => {

  it("rejects invalid URLs", async () => {
    const res = await request(app)
      .post("/shorten")
      .send({ originalUrl: "invalid-url" });

    expect(res.status).toBe(400);
  });

  it("creates a short URL", async () => {
    createShortUrl.mockResolvedValueOnce({
      originalUrl: "https://example.com/",
      shortCode: "abc1234"
    });

    const res = await request(app)
      .post("/shorten")
      .send({
        originalUrl: "https://example.com"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.shortCode).toBe("abc1234");
  });

  it("redirects with status 302", async () => {
    getOriginalUrl.mockResolvedValueOnce({
      originalUrl: "https://example.com/"
    });

    incrementClicks.mockResolvedValueOnce({});

    const res = await request(app)
      .get("/abc1234");

    expect(res.status).toBe(302);
    expect(res.headers.location)
      .toBe("https://example.com/");
  });

  it("returns 404 for missing short URL", async () => {
    getOriginalUrl.mockResolvedValueOnce(null);

    const res = await request(app)
      .get("/unknown");

    expect(res.status).toBe(404);
  });
});