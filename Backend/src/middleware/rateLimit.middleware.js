import rateLimit from "express-rate-limit";
import { BadRequestError } from "../core/error.response.js";
import UserLimit from "../models/chatLimitModel.js";

export const RateLimiterMiddleware = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    handler: (req, res, next) => {
      throw new BadRequestError("Rate limit exceeded");
    },
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

// Specific limiters for different endpoints can be created
export const ChatRateLimiter = RateLimiterMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
});

export const questionRateLimiter = async (req, res, next) => {
  const MAX_QUESTIONS_PER_HOUR = 5;

  try {
    const userId = req.user.userId;
    let userLimit = await UserLimit.findOne({ userId });

    if (!userLimit) {
      userLimit = new UserLimit({ userId });
    }

    // Kiểm tra và reset counter nếu đã qua 1 giờ
    if (userLimit.shouldResetCount()) {
      userLimit.questionCount = 0;
      userLimit.lastResetTime = new Date();
    }

    // Kiểm tra limit
    if (userLimit.questionCount >= MAX_QUESTIONS_PER_HOUR) {
      const timeUntilReset =
        60 - (Date.now() - userLimit.lastResetTime.getTime()) / (1000 * 60);
      return res.status(429).json({
        success: false,
        message: "Question limit exceeded. Please try again later.",
        minutesUntilReset: Math.ceil(timeUntilReset),
      });
    }

    // Tăng counter
    userLimit.questionCount += 1;
    await userLimit.save();

    next();
  } catch (error) {
    next(error);
  }
};
