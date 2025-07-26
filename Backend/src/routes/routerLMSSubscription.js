import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import SubscriptionController from "../controllers/subscriptionController.js";

const routerSubscription = Router();

// Create a new subscription
// POST /api/v1/subscriptions
routerSubscription.post(
  "/",
  asyncHandler(SubscriptionController.createSubscription)
);

// Get all subscriptions
// GET /api/v1/subscriptions
routerSubscription.get(
  "/",
  asyncHandler(SubscriptionController.getAllSubscriptions)
);

// Get subscriptions by student ID
// GET /api/v1/subscriptions/student/:studentId
routerSubscription.get(
  "/student/:studentId",
  asyncHandler(SubscriptionController.getSubscriptionsByStudentId)
);

// Get active subscription for student
// GET /api/v1/subscriptions/student/:studentId/active
routerSubscription.get(
  "/student/:studentId/active",
  asyncHandler(SubscriptionController.getActiveSubscription)
);

// Get subscription statistics for a student
// GET /api/v1/subscriptions/student/:studentId/stats
routerSubscription.get(
  "/student/:studentId/stats",
  asyncHandler(SubscriptionController.getSubscriptionStats)
);

// Use one session from subscription
// PATCH /api/v1/subscriptions/:id/use
routerSubscription.patch(
  "/:id/use",
  asyncHandler(SubscriptionController.useSession)
);

// Cancel subscription
// PATCH /api/v1/subscriptions/:id/cancel
routerSubscription.patch(
  "/:id/cancel",
  asyncHandler(SubscriptionController.cancelSubscription)
);

// Get subscription by ID (must be after specific routes)
// GET /api/v1/subscriptions/:id
routerSubscription.get(
  "/:id",
  asyncHandler(SubscriptionController.getSubscriptionById)
);

// Update subscription
// PUT /api/v1/subscriptions/:id
routerSubscription.put(
  "/:id",
  asyncHandler(SubscriptionController.updateSubscription)
);

export default routerSubscription;
