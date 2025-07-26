import { SuccessResponse } from "../core/success.response.js";
import SubscriptionPackageService from "../services/subscriptionPackageService.js";

class SubscriptionPackageController {
  /**
   * Create a new subscription package
   * POST /api/v1/subscription-packages
   */
  static async createPackage(req, res) {
    const packageData = req.body;

    console.log("packageData ne", packageData);
    const newPackage = await SubscriptionPackageService.createPackage(
      packageData
    );

    new SuccessResponse({
      message: "Subscription package created successfully",
      data: newPackage,
    }).send(res);
  }

  /**
   * Get all subscription packages
   * GET /api/v1/subscription-packages
   */
  static async getAllPackages(req, res) {
    const filters = req.query;

    const packages = await SubscriptionPackageService.getAllPackages(filters);

    new SuccessResponse({
      message: "Subscription packages retrieved successfully",
      data: packages,
    }).send(res);
  }

  /**
   * Get package by ID
   * GET /api/v1/subscription-packages/:id
   */
  static async getPackageById(req, res) {
    const { id } = req.params;

    const package_ = await SubscriptionPackageService.getPackageById(id);

    new SuccessResponse({
      message: "Subscription package retrieved successfully",
      data: package_,
    }).send(res);
  }

  /**
   * Update package
   * PUT /api/v1/subscription-packages/:id
   */
  static async updatePackage(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPackage = await SubscriptionPackageService.updatePackage(
      id,
      updateData
    );

    new SuccessResponse({
      message: "Subscription package updated successfully",
      data: updatedPackage,
    }).send(res);
  }

  /**
   * Toggle package status (active/inactive)
   * PATCH /api/v1/subscription-packages/:id/toggle-status
   */
  static async togglePackageStatus(req, res) {
    const { id } = req.params;

    const result = await SubscriptionPackageService.togglePackageStatus(id);

    new SuccessResponse({
      message: result.message,
      data: result.package,
    }).send(res);
  }

  /**
   * Delete package (only if no subscriptions exist)
   * DELETE /api/v1/subscription-packages/:id
   */
  static async deletePackage(req, res) {
    const { id } = req.params;

    const result = await SubscriptionPackageService.deletePackage(id);

    new SuccessResponse({
      message: result.message,
      data: {},
    }).send(res);
  }

  /**
   * Get package statistics
   * GET /api/v1/subscription-packages/:id/stats
   */
  static async getPackageStats(req, res) {
    const { id } = req.params;

    const stats = await SubscriptionPackageService.getPackageStats(id);

    new SuccessResponse({
      message: "Package statistics retrieved successfully",
      data: stats,
    }).send(res);
  }

  /**
   * Get popular packages
   * GET /api/v1/subscription-packages/popular
   */
  static async getPopularPackages(req, res) {
    const { limit } = req.query;

    const popularPackages = await SubscriptionPackageService.getPopularPackages(
      limit ? parseInt(limit) : 5
    );

    new SuccessResponse({
      message: "Popular packages retrieved successfully",
      data: popularPackages,
    }).send(res);
  }
}

export default SubscriptionPackageController;
