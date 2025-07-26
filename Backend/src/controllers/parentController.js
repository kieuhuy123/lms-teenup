import { SuccessResponse } from "../core/success.response.js";
import ParentService from "../services/parentService.js";

class ParentController {
  /**
   * Create a new parent
   * POST /api/v1/parents
   */
  static async createParent(req, res) {
    const { name, phone, email } = req.body;

    const newParent = await ParentService.createParent({
      name,
      phone,
      email,
    });

    new SuccessResponse({
      message: "Parent created successfully",
      data: newParent,
    }).send(res);
  }

  /**
   * Get parent by ID
   * GET /api/v1/parents/:id
   */
  static async getParentById(req, res) {
    const { id } = req.params;

    const parent = await ParentService.getParentById(id);

    new SuccessResponse({
      message: "Parent retrieved successfully",
      data: parent,
    }).send(res);
  }

  /**
   * Get all parents
   * GET /api/v1/parents
   */
  static async getAllParents(req, res) {
    const parents = await ParentService.getAllParents();

    new SuccessResponse({
      message: "Parents retrieved successfully",
      data: parents,
    }).send(res);
  }

  /**
   * Update parent
   * PUT /api/v1/parents/:id
   */
  static async updateParent(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const updatedParent = await ParentService.updateParent(id, updateData);

    new SuccessResponse({
      message: "Parent updated successfully",
      data: updatedParent,
    }).send(res);
  }

  /**
   * Delete parent
   * DELETE /api/v1/parents/:id
   */
  static async deleteParent(req, res) {
    const { id } = req.params;

    const result = await ParentService.deleteParent(id);

    new SuccessResponse({
      message: result.message,
      data: {},
    }).send(res);
  }
}

export default ParentController;
