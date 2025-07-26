import { Router } from "express";
const router = Router();

// Import new LMS routes
import routerParent from "./routerParent.js";
import routerStudent from "./routerStudent.js";
import routerClass from "./routerClass.js";
import routerLMSSubscription from "./routerLMSSubscription.js";
import routerSubscriptionPackage from "./routerSubscriptionPackage.js";

// Public routes

// New LMS routes
router.use("/api/v1/parents", routerParent);
router.use("/api/v1/students", routerStudent);
router.use("/api/v1/classes", routerClass);
router.use("/api/v1/lms-subscriptions", routerLMSSubscription);
router.use("/api/v1/subscription-packages", routerSubscriptionPackage);

router.use("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Handle 404 routes
router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  });
});

export default router;
