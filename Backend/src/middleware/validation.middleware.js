import { validateMessage } from "../validator/chat.validator.js";

export const validateMessageMiddleware = (req, res, next) => {
  const { content } = req.body;

  // Check if content exists
  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  // Validate message content
  const error = validateMessage(content);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }

  next();
};

// Simple rate limiting middleware
export const rateLimitMiddleware = (options) => {
  const { windowMs = 900000, max = 100 } = options; // default 15 minutes, 100 requests
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    for (let [key, timestamp] of requests) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Count requests in window
    const requestCount = Array.from(requests.values()).filter(
      (timestamp) => timestamp > windowStart
    ).length;

    if (requestCount >= max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later.",
      });
    }

    requests.set(`${ip}-${now}`, now);
    next();
  };
};
