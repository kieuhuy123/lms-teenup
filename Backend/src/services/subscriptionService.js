import subscriptionModel from "../models/subscriptionModel.js";
import subscriptionPackageModel from "../models/subscriptionPackageModel.js";
import studentModel from "../models/studentModel.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

class SubscriptionService {
  /**
   * Create a new subscription (UPDATED LOGIC)
   * @param {Object} subscriptionData
   * @returns {Promise<Object>}
   */
  static async createSubscription(subscriptionData) {
    const { student_id, package_id, start_date } = subscriptionData;

    // Validate student exists
    const student = await studentModel.findById(student_id);
    if (!student) {
      throw new BadRequestError("Student not found");
    }

    console.log("package_id ne", package_id);
    // Validate package exists and is active
    const package_ = await subscriptionPackageModel.findById(package_id);
    if (!package_) {
      throw new BadRequestError("Subscription package not found");
    }
    if (package_.status !== "active") {
      throw new BadRequestError("Subscription package is not active");
    }

    // Validate start date
    const startDate = new Date(start_date);
    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      throw new BadRequestError("Start date cannot be in the past");
    }

    // Auto calculate end_date from package duration
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + package_.duration_days);

    // Create new subscription with data from package
    const newSubscription = await subscriptionModel.create({
      student_id,
      package_id,
      start_date: startDate,
      end_date: endDate,
      total_sessions: package_.total_sessions, // Auto copy from package
      used_sessions: 0,
      status: "active",
    });

    // Return subscription with populated data
    const populatedSubscription = await subscriptionModel
      .findById(newSubscription._id)
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    return populatedSubscription;
  }

  /**
   * Get subscription by ID
   * @param {string} subscriptionId
   * @returns {Promise<Object>}
   */
  static async getSubscriptionById(subscriptionId) {
    if (!subscriptionId) {
      throw new BadRequestError("Subscription ID is required");
    }

    const subscription = await subscriptionModel
      .findById(subscriptionId)
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    // Check if subscription is expired
    if (
      subscription.end_date < new Date() &&
      subscription.status === "active"
    ) {
      subscription.status = "expired";
      await subscription.save();
    }

    return subscription;
  }

  /**
   * Use one session from subscription
   * @param {string} subscriptionId
   * @returns {Promise<Object>}
   */
  static async useSession(subscriptionId) {
    if (!subscriptionId) {
      throw new BadRequestError("Subscription ID is required");
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    // Check if subscription is active
    if (subscription.status !== "active") {
      throw new BadRequestError("Subscription is not active");
    }

    // Check if subscription is expired
    if (subscription.end_date < new Date()) {
      subscription.status = "expired";
      await subscription.save();
      throw new BadRequestError("Subscription has expired");
    }

    // Check if there are remaining sessions
    if (subscription.used_sessions >= subscription.total_sessions) {
      throw new BadRequestError("No remaining sessions in this subscription");
    }

    // Use one session
    subscription.used_sessions += 1;

    // Mark as completed if all sessions are used
    if (subscription.used_sessions >= subscription.total_sessions) {
      subscription.status = "expired";
    }

    await subscription.save();

    // Return updated subscription with populated data
    const updatedSubscription = await subscriptionModel
      .findById(subscriptionId)
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    return updatedSubscription;
  }

  /**
   * Get subscriptions by student ID
   * @param {string} studentId
   * @returns {Promise<Array>}
   */
  static async getSubscriptionsByStudentId(studentId) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const subscriptions = await subscriptionModel
      .find({ student_id: studentId })
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price")
      .sort({ createdAt: -1 });

    // Update expired subscriptions
    const currentDate = new Date();
    const updatePromises = subscriptions.map(async (subscription) => {
      if (
        subscription.end_date < currentDate &&
        subscription.status === "active"
      ) {
        subscription.status = "expired";
        await subscription.save();
      }
      return subscription;
    });

    await Promise.all(updatePromises);

    return subscriptions;
  }

  /**
   * Get active subscription for student
   * @param {string} studentId
   * @returns {Promise<Object|null>}
   */
  static async getActiveSubscription(studentId) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const currentDate = new Date();

    console.log("currentDate", currentDate);
    const activeSubscription = await subscriptionModel
      .findOne({
        student_id: studentId,
        status: "active",
      })
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    return activeSubscription;
  }

  /**
   * Get all subscriptions (utility method)
   * @returns {Promise<Array>}
   */
  static async getAllSubscriptions() {
    const subscriptions = await subscriptionModel
      .find({})
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price")
      .sort({ createdAt: -1 });

    return subscriptions;
  }

  /**
   * Update subscription
   * @param {string} subscriptionId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  static async updateSubscription(subscriptionId, updateData) {
    if (!subscriptionId) {
      throw new BadRequestError("Subscription ID is required");
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    // Validate dates if being updated
    if (updateData.start_date || updateData.end_date) {
      const startDate = updateData.start_date
        ? new Date(updateData.start_date)
        : subscription.start_date;
      const endDate = updateData.end_date
        ? new Date(updateData.end_date)
        : subscription.end_date;

      if (startDate >= endDate) {
        throw new BadRequestError("End date must be after start date");
      }

      updateData.start_date = startDate;
      updateData.end_date = endDate;
    }

    // Validate used_sessions doesn't exceed total_sessions
    if (
      updateData.used_sessions !== undefined ||
      updateData.total_sessions !== undefined
    ) {
      const usedSessions =
        updateData.used_sessions !== undefined
          ? updateData.used_sessions
          : subscription.used_sessions;
      const totalSessions =
        updateData.total_sessions !== undefined
          ? updateData.total_sessions
          : subscription.total_sessions;

      if (usedSessions > totalSessions) {
        throw new BadRequestError("Used sessions cannot exceed total sessions");
      }

      if (usedSessions < 0) {
        throw new BadRequestError("Used sessions cannot be negative");
      }
    }

    const updatedSubscription = await subscriptionModel
      .findByIdAndUpdate(subscriptionId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    return updatedSubscription;
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId
   * @returns {Promise<Object>}
   */
  static async cancelSubscription(subscriptionId) {
    if (!subscriptionId) {
      throw new BadRequestError("Subscription ID is required");
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    if (subscription.status === "cancelled") {
      throw new BadRequestError("Subscription is already cancelled");
    }

    subscription.status = "cancelled";
    await subscription.save();

    const cancelledSubscription = await subscriptionModel
      .findById(subscriptionId)
      .populate("student_id", "name current_grade")
      .populate("package_id", "name total_sessions duration_days price");

    return cancelledSubscription;
  }

  /**
   * Get subscription statistics for a student
   * @param {string} studentId
   * @returns {Promise<Object>}
   */
  static async getSubscriptionStats(studentId) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const subscriptions = await subscriptionModel.find({
      student_id: studentId,
    });

    const stats = {
      total_subscriptions: subscriptions.length,
      active_subscriptions: subscriptions.filter((s) => s.status === "active")
        .length,
      expired_subscriptions: subscriptions.filter((s) => s.status === "expired")
        .length,
      cancelled_subscriptions: subscriptions.filter(
        (s) => s.status === "cancelled"
      ).length,
      total_sessions_purchased: subscriptions.reduce(
        (sum, s) => sum + s.total_sessions,
        0
      ),
      total_sessions_used: subscriptions.reduce(
        (sum, s) => sum + s.used_sessions,
        0
      ),
    };

    stats.total_sessions_remaining =
      stats.total_sessions_purchased - stats.total_sessions_used;

    return stats;
  }
}

export default SubscriptionService;
