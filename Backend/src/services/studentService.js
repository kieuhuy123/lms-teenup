import studentModel from "../models/studentModel.js";
import parentModel from "../models/parentModel.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

class StudentService {
  /**
   * Create a new student
   * @param {Object} studentData
   * @returns {Promise<Object>}
   */
  static async createStudent(studentData) {
    const { name, dob, gender, current_grade, parent_id } = studentData;

    // Validate parent exists
    const parent = await parentModel.findById(parent_id);
    if (!parent) {
      throw new BadRequestError("Parent not found");
    }

    // Validate date of birth
    const dobDate = new Date(dob);
    if (dobDate > new Date()) {
      throw new BadRequestError("Date of birth cannot be in the future");
    }

    // Create new student
    const newStudent = await studentModel.create({
      name,
      dob: dobDate,
      gender,
      current_grade,
      parent_id,
    });

    return newStudent;
  }

  /**
   * Get student by ID with parent information
   * @param {string} studentId
   * @returns {Promise<Object>}
   */
  static async getStudentById(studentId) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const student = await studentModel
      .findById(studentId)
      .populate("parent_id", "name phone email");

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    return student;
  }

  /**
   * Get all students (utility method)
   * @returns {Promise<Array>}
   */
  static async getAllStudents() {
    const students = await studentModel
      .find({})
      .populate("parent_id", "name phone email")
      .sort({ createdAt: -1 });

    return students;
  }

  /**
   * Get students by parent ID
   * @param {string} parentId
   * @returns {Promise<Array>}
   */
  static async getStudentsByParentId(parentId) {
    if (!parentId) {
      throw new BadRequestError("Parent ID is required");
    }

    const students = await studentModel
      .find({ parent_id: parentId })
      .populate("parent_id", "name phone email")
      .sort({ createdAt: -1 });

    return students;
  }

  /**
   * Update student
   * @param {string} studentId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  static async updateStudent(studentId, updateData) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const student = await studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Validate parent if being updated
    if (updateData.parent_id) {
      const parent = await parentModel.findById(updateData.parent_id);
      if (!parent) {
        throw new BadRequestError("Parent not found");
      }
    }

    // Validate date of birth if being updated
    if (updateData.dob) {
      const dobDate = new Date(updateData.dob);
      if (dobDate > new Date()) {
        throw new BadRequestError("Date of birth cannot be in the future");
      }
      updateData.dob = dobDate;
    }

    const updatedStudent = await studentModel
      .findByIdAndUpdate(studentId, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("parent_id", "name phone email");

    return updatedStudent;
  }

  /**
   * Delete student
   * @param {string} studentId
   * @returns {Promise<Object>}
   */
  static async deleteStudent(studentId) {
    if (!studentId) {
      throw new BadRequestError("Student ID is required");
    }

    const student = await studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    await studentModel.findByIdAndDelete(studentId);

    return { message: "Student deleted successfully" };
  }

  /**
   * Get students by grade (utility method)
   * @param {string} grade
   * @returns {Promise<Array>}
   */
  static async getStudentsByGrade(grade) {
    if (!grade) {
      throw new BadRequestError("Grade is required");
    }

    const students = await studentModel
      .find({ current_grade: grade })
      .populate("parent_id", "name phone email")
      .sort({ createdAt: -1 });

    return students;
  }
}

export default StudentService;
