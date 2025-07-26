import { SuccessResponse } from "../core/success.response.js";
import ClassService from "../services/classService.js";

class ClassController {
  /**
   * Create a new class
   * POST /api/v1/classes
   */
  static async createClass(req, res) {
    const {
      name,
      subject,
      day_of_week,
      time_slot,
      teacher_name,
      max_students,
    } = req.body;

    const newClass = await ClassService.createClass({
      name,
      subject,
      day_of_week,
      time_slot,
      teacher_name,
      max_students,
    });

    new SuccessResponse({
      message: "Class created successfully",
      data: newClass,
    }).send(res);
  }

  /**
   * Get class by ID
   * GET /api/v1/classes/:id
   */
  static async getClassById(req, res) {
    const { id } = req.params;

    const classInfo = await ClassService.getClassById(id);

    new SuccessResponse({
      message: "Class retrieved successfully",
      data: classInfo,
    }).send(res);
  }

  /**
   * Get classes by day of week or all classes
   * GET /api/v1/classes?day=monday
   * GET /api/v1/classes
   */
  static async getClasses(req, res) {
    const { day } = req.query;

    let classes;
    if (day) {
      classes = await ClassService.getClassesByDay(day);
    } else {
      classes = await ClassService.getAllClasses();
    }

    new SuccessResponse({
      message: day
        ? `Classes for ${day} retrieved successfully`
        : "All classes retrieved successfully",
      data: classes,
    }).send(res);
  }

  /**
   * Register student to class
   * POST /api/v1/classes/:id/register
   */
  static async registerStudentToClass(req, res) {
    const { id: classId } = req.params;
    const { student_id } = req.body;

    const registration = await ClassService.registerStudentToClass(
      classId,
      student_id
    );

    new SuccessResponse({
      message: "Student registered to class successfully",
      data: registration,
    }).send(res);
  }

  /**
   * Get students registered for a class
   * GET /api/v1/classes/:id/students
   */
  static async getClassStudents(req, res) {
    const { id: classId } = req.params;

    const students = await ClassService.getClassStudents(classId);

    new SuccessResponse({
      message: "Class students retrieved successfully",
      data: students,
    }).send(res);
  }

  /**
   * Update class
   * PUT /api/v1/classes/:id
   */
  static async updateClass(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    // Note: This method would need to be implemented in ClassService
    // For now, we'll return a placeholder response
    new SuccessResponse({
      message: "Class update functionality not implemented yet",
      data: { id, updateData },
    }).send(res);
  }

  /**
   * Delete class
   * DELETE /api/v1/classes/:id
   */
  static async deleteClass(req, res) {
    const { id } = req.params;

    // Note: This method would need to be implemented in ClassService
    // For now, we'll return a placeholder response
    new SuccessResponse({
      message: "Class deletion functionality not implemented yet",
      data: { id },
    }).send(res);
  }
}

export default ClassController;
