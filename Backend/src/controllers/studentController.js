import { SuccessResponse } from "../core/success.response.js";
import StudentService from "../services/studentService.js";

class StudentController {
  /**
   * Create a new student
   * POST /api/v1/students
   */
  static async createStudent(req, res) {
    const { name, dob, gender, current_grade, parent_id } = req.body;

    const newStudent = await StudentService.createStudent({
      name,
      dob,
      gender,
      current_grade,
      parent_id,
    });

    new SuccessResponse({
      message: "Student created successfully",
      data: newStudent,
    }).send(res);
  }

  /**
   * Get student by ID with parent information
   * GET /api/v1/students/:id
   */
  static async getStudentById(req, res) {
    const { id } = req.params;

    const student = await StudentService.getStudentById(id);

    new SuccessResponse({
      message: "Student retrieved successfully",
      data: student,
    }).send(res);
  }

  /**
   * Get all students
   * GET /api/v1/students
   */
  static async getAllStudents(req, res) {
    const students = await StudentService.getAllStudents();

    new SuccessResponse({
      message: "Students retrieved successfully",
      data: students,
    }).send(res);
  }

  /**
   * Get students by parent ID
   * GET /api/v1/students/parent/:parentId
   */
  static async getStudentsByParentId(req, res) {
    const { parentId } = req.params;

    const students = await StudentService.getStudentsByParentId(parentId);

    new SuccessResponse({
      message: "Students retrieved successfully",
      data: students,
    }).send(res);
  }

  /**
   * Get students by grade
   * GET /api/v1/students/grade/:grade
   */
  static async getStudentsByGrade(req, res) {
    const { grade } = req.params;

    const students = await StudentService.getStudentsByGrade(grade);

    new SuccessResponse({
      message: "Students retrieved successfully",
      data: students,
    }).send(res);
  }

  /**
   * Update student
   * PUT /api/v1/students/:id
   */
  static async updateStudent(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStudent = await StudentService.updateStudent(id, updateData);

    new SuccessResponse({
      message: "Student updated successfully",
      data: updatedStudent,
    }).send(res);
  }

  /**
   * Delete student
   * DELETE /api/v1/students/:id
   */
  static async deleteStudent(req, res) {
    const { id } = req.params;

    const result = await StudentService.deleteStudent(id);

    new SuccessResponse({
      message: result.message,
      data: {},
    }).send(res);
  }
}

export default StudentController;
