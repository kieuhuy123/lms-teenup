import { SuccessResponse } from "../core/success.response.js";
import SubscriptionService from "../services/subscriptionService.js";

class SubscriptionController {
  /**
   * Create a new subscription
   * POST /api/v1/subscriptions
   */
  static async createSubscription(req, res) {
    const { student_id, package_id, start_date, end_date, total_sessions } =
      req.body;

    const newSubscription = await SubscriptionService.createSubscription({
      student_id,
      package_id,
      start_date,
      end_date,
      total_sessions,
    });

    new SuccessResponse({
      message: "Subscription created successfully",
      data: newSubscription,
    }).send(res);
  }

  /**
   * Get subscription by ID
   * GET /api/v1/subscriptions/:id
   */
  static async getSubscriptionById(req, res) {
    const { id } = req.params;

    const subscription = await SubscriptionService.getSubscriptionById(id);

    new SuccessResponse({
      message: "Subscription retrieved successfully",
      data: subscription,
    }).send(res);
  }

  /**
   * Use one session from subscription
   * PATCH /api/v1/subscriptions/:id/use
   */
  static async useSession(req, res) {
    const { id } = req.params;

    const updatedSubscription = await SubscriptionService.useSession(id);

    new SuccessResponse({
      message: "Session used successfully",
      data: updatedSubscription,
    }).send(res);
  }

  /**
   * Get subscriptions by student ID
   * GET /api/v1/subscriptions/student/:studentId
   */
  static async getSubscriptionsByStudentId(req, res) {
    const { studentId } = req.params;

    const subscriptions = await SubscriptionService.getSubscriptionsByStudentId(
      studentId
    );

    new SuccessResponse({
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    }).send(res);
  }

  /**
   * Get active subscription for student
   * GET /api/v1/subscriptions/student/:studentId/active
   */
  static async getActiveSubscription(req, res) {
    const { studentId } = req.params;

    const activeSubscription = await SubscriptionService.getActiveSubscription(
      studentId
    );

    new SuccessResponse({
      message: activeSubscription
        ? "Active subscription retrieved successfully"
        : "No active subscription found",
      data: activeSubscription,
    }).send(res);
  }

  /**
   * Get all subscriptions
   * GET /api/v1/subscriptions
   */
  static async getAllSubscriptions(req, res) {
    const subscriptions = await SubscriptionService.getAllSubscriptions();

    new SuccessResponse({
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    }).send(res);
  }

  /**
   * Update subscription
   * PUT /api/v1/subscriptions/:id
   */
  static async updateSubscription(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubscription = await SubscriptionService.updateSubscription(
      id,
      updateData
    );

    new SuccessResponse({
      message: "Subscription updated successfully",
      data: updatedSubscription,
    }).send(res);
  }

  /**
   * Cancel subscription
   * PATCH /api/v1/subscriptions/:id/cancel
   */
  static async cancelSubscription(req, res) {
    const { id } = req.params;

    const cancelledSubscription = await SubscriptionService.cancelSubscription(
      id
    );

    new SuccessResponse({
      message: "Subscription cancelled successfully",
      data: cancelledSubscription,
    }).send(res);
  }

  /**
   * Get subscription statistics for a student
   * GET /api/v1/subscriptions/student/:studentId/stats
   */
  static async getSubscriptionStats(req, res) {
    const { studentId } = req.params;

    const stats = await SubscriptionService.getSubscriptionStats(studentId);

    new SuccessResponse({
      message: "Subscription statistics retrieved successfully",
      data: stats,
    }).send(res);
  }
}

export default SubscriptionController;
