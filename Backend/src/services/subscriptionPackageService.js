import subscriptionPackageModel from "../models/subscriptionPackageModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

class SubscriptionPackageService {
  /**
   * Create a new subscription package
   * @param {Object} packageData
   * @returns {Promise<Object>}
   */
  static async createPackage(packageData) {
    const { name, description, total_sessions, duration_days, price } =
      packageData;

    // Check if package with same name already exists
    const existingPackage = await subscriptionPackageModel.findOne({ name });
    if (existingPackage) {
      throw new BadRequestError("Package with this name already exists");
    }

    // Validate business rules
    if (total_sessions <= 0) {
      throw new BadRequestError("Total sessions must be greater than 0");
    }

    if (duration_days <= 0) {
      throw new BadRequestError("Duration must be greater than 0 days");
    }

    if (price && price < 0) {
      throw new BadRequestError("Price cannot be negative");
    }

    const newPackage = await subscriptionPackageModel.create({
      name: name.trim(),
      description: description?.trim() || "",
      total_sessions,
      duration_days,
      price: price || 0,
      status: "active", // Default status
    });

    return newPackage;
  }

  /**
   * Get all subscription packages with optional filtering
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  static async getAllPackages(filters = {}) {
    const { status } = filters;

    let filter = {};
    if (status) {
      if (!["active", "inactive"].includes(status)) {
        throw new BadRequestError("Status must be 'active' or 'inactive'");
      }
      filter.status = status;
    }

    const packages = await subscriptionPackageModel
      .find(filter)
      .sort({ createdAt: -1 });

    return packages;
  }

  /**
   * Get package by ID
   * @param {string} packageId
   * @returns {Promise<Object>}
   */
  static async getPackageById(packageId) {
    if (!packageId) {
      throw new BadRequestError("Package ID is required");
    }

    const package_ = await subscriptionPackageModel.findById(packageId);
    if (!package_) {
      throw new NotFoundError("Subscription package not found");
    }

    // Get additional stats (optional)
    const subscriptionCount = await subscriptionModel.countDocuments({
      package_id: packageId,
    });

    return {
      ...package_.toObject(),
      subscription_count: subscriptionCount,
    };
  }

  /**
   * Update package
   * @param {string} packageId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  static async updatePackage(packageId, updateData) {
    if (!packageId) {
      throw new BadRequestError("Package ID is required");
    }

    const package_ = await subscriptionPackageModel.findById(packageId);
    if (!package_) {
      throw new NotFoundError("Subscription package not found");
    }

    // Check if name is being updated and if it's unique
    if (updateData.name && updateData.name !== package_.name) {
      const existingPackage = await subscriptionPackageModel.findOne({
        name: updateData.name,
        _id: { $ne: packageId },
      });
      if (existingPackage) {
        throw new BadRequestError("Package with this name already exists");
      }
    }

    // Validate business rules for updates
    if (updateData.total_sessions && updateData.total_sessions <= 0) {
      throw new BadRequestError("Total sessions must be greater than 0");
    }

    if (updateData.duration_days && updateData.duration_days <= 0) {
      throw new BadRequestError("Duration must be greater than 0 days");
    }

    if (updateData.price && updateData.price < 0) {
      throw new BadRequestError("Price cannot be negative");
    }

    // Clean data
    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }
    if (updateData.description) {
      updateData.description = updateData.description.trim();
    }

    const updatedPackage = await subscriptionPackageModel.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedPackage;
  }

  /**
   * Toggle package status (active/inactive)
   * @param {string} packageId
   * @returns {Promise<Object>}
   */
  static async togglePackageStatus(packageId) {
    if (!packageId) {
      throw new BadRequestError("Package ID is required");
    }

    const package_ = await subscriptionPackageModel.findById(packageId);
    if (!package_) {
      throw new NotFoundError("Subscription package not found");
    }

    // Business rule: Cannot deactivate if there are active subscriptions
    if (package_.status === "active") {
      const activeSubscriptions = await subscriptionModel.countDocuments({
        package_id: packageId,
        status: "active",
      });

      if (activeSubscriptions > 0) {
        throw new BadRequestError(
          `Cannot deactivate package. There are ${activeSubscriptions} active subscriptions using this package.`
        );
      }
    }

    const newStatus = package_.status === "active" ? "inactive" : "active";
    package_.status = newStatus;
    await package_.save();

    return {
      package: package_,
      message: `Package ${
        newStatus === "active" ? "activated" : "deactivated"
      } successfully`,
    };
  }

  /**
   * Delete package (only if no subscriptions exist)
   * @param {string} packageId
   * @returns {Promise<Object>}
   */
  static async deletePackage(packageId) {
    if (!packageId) {
      throw new BadRequestError("Package ID is required");
    }

    const package_ = await subscriptionPackageModel.findById(packageId);
    if (!package_) {
      throw new NotFoundError("Subscription package not found");
    }

    // Business rule: Cannot delete if there are any subscriptions (active or inactive)
    const subscriptionCount = await subscriptionModel.countDocuments({
      package_id: packageId,
    });

    if (subscriptionCount > 0) {
      throw new BadRequestError(
        `Cannot delete package. There are ${subscriptionCount} subscriptions associated with this package. Please cancel all subscriptions first.`
      );
    }

    await subscriptionPackageModel.findByIdAndDelete(packageId);

    return {
      message: "Subscription package deleted successfully",
      deleted_package: package_,
    };
  }

  /**
   * Get package statistics
   * @param {string} packageId
   * @returns {Promise<Object>}
   */
  static async getPackageStats(packageId) {
    if (!packageId) {
      throw new BadRequestError("Package ID is required");
    }

    const package_ = await subscriptionPackageModel.findById(packageId);
    if (!package_) {
      throw new NotFoundError("Subscription package not found");
    }

    // Get subscription statistics
    const subscriptions = await subscriptionModel.find({
      package_id: packageId,
    });

    const stats = {
      package_info: package_,
      total_subscriptions: subscriptions.length,
      active_subscriptions: subscriptions.filter((s) => s.status === "active")
        .length,
      expired_subscriptions: subscriptions.filter((s) => s.status === "expired")
        .length,
      cancelled_subscriptions: subscriptions.filter(
        (s) => s.status === "cancelled"
      ).length,
      total_revenue: subscriptions.length * package_.price,
      total_sessions_sold: subscriptions.length * package_.total_sessions,
      total_sessions_used: subscriptions.reduce(
        (sum, s) => sum + s.used_sessions,
        0
      ),
    };

    stats.sessions_utilization_rate =
      stats.total_sessions_sold > 0
        ? (
            (stats.total_sessions_used / stats.total_sessions_sold) *
            100
          ).toFixed(2) + "%"
        : "0%";

    return stats;
  }
}

export default SubscriptionPackageService;
