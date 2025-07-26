import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import SubscriptionPackageController from "../controllers/subscriptionPackageController.js";

const routerSubscriptionPackage = Router();

// Create a new subscription package
// POST /api/v1/subscription-packages
routerSubscriptionPackage.post(
  "/",
  asyncHandler(SubscriptionPackageController.createPackage)
);

// Get all subscription packages
// GET /api/v1/subscription-packages
// GET /api/v1/subscription-packages?status=active
routerSubscriptionPackage.get(
  "/",
  asyncHandler(SubscriptionPackageController.getAllPackages)
);

// Toggle package status
// PATCH /api/v1/subscription-packages/:id/toggle-status
routerSubscriptionPackage.patch(
  "/:id/toggle-status",
  asyncHandler(SubscriptionPackageController.togglePackageStatus)
);

// Get package by ID (must be after specific routes)
// GET /api/v1/subscription-packages/:id
routerSubscriptionPackage.get(
  "/:id",
  asyncHandler(SubscriptionPackageController.getPackageById)
);

// Update package
// PUT /api/v1/subscription-packages/:id
routerSubscriptionPackage.put(
  "/:id",
  asyncHandler(SubscriptionPackageController.updatePackage)
);

// Delete package
// DELETE /api/v1/subscription-packages/:id
routerSubscriptionPackage.delete(
  "/:id",
  asyncHandler(SubscriptionPackageController.deletePackage)
);

export default routerSubscriptionPackage;
