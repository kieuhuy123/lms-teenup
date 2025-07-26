import parentModel from "../models/parentModel.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

class ParentService {
  /**
   * Create a new parent
   * @param {Object} parentData
   * @returns {Promise<Object>}
   */
  static async createParent(parentData) {
    const { name, phone, email } = parentData;

    // Check if parent with email already exists
    const existingParent = await parentModel.findOne({ email });
    if (existingParent) {
      throw new BadRequestError("Parent with this email already exists");
    }

    // Create new parent
    const newParent = await parentModel.create({
      name,
      phone,
      email,
    });

    return newParent;
  }

  /**
   * Get parent by ID
   * @param {string} parentId
   * @returns {Promise<Object>}
   */
  static async getParentById(parentId) {
    if (!parentId) {
      throw new BadRequestError("Parent ID is required");
    }

    const parent = await parentModel.findById(parentId);
    if (!parent) {
      throw new NotFoundError("Parent not found");
    }

    return parent;
  }

  /**
   * Get all parents (utility method)
   * @returns {Promise<Array>}
   */
  static async getAllParents() {
    const parents = await parentModel.find({}).sort({ createdAt: -1 });
    return parents;
  }

  /**
   * Update parent
   * @param {string} parentId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  static async updateParent(parentId, updateData) {
    if (!parentId) {
      throw new BadRequestError("Parent ID is required");
    }

    const parent = await parentModel.findById(parentId);
    if (!parent) {
      throw new NotFoundError("Parent not found");
    }

    // Check if email is being updated and if it's unique
    if (updateData.email && updateData.email !== parent.email) {
      const existingParent = await parentModel.findOne({
        email: updateData.email,
        _id: { $ne: parentId },
      });
      if (existingParent) {
        throw new BadRequestError("Parent with this email already exists");
      }
    }

    const updatedParent = await parentModel.findByIdAndUpdate(
      parentId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedParent;
  }

  /**
   * Delete parent
   * @param {string} parentId
   * @returns {Promise<Object>}
   */
  static async deleteParent(parentId) {
    if (!parentId) {
      throw new BadRequestError("Parent ID is required");
    }

    const parent = await parentModel.findById(parentId);
    if (!parent) {
      throw new NotFoundError("Parent not found");
    }

    await parentModel.findByIdAndDelete(parentId);

    return { message: "Parent deleted successfully" };
  }
}

export default ParentService;
