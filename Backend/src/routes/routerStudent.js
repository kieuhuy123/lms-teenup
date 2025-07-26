import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import StudentController from "../controllers/studentController.js";

const routerStudent = Router();

// Create a new student
// POST /api/v1/students
routerStudent.post("/", asyncHandler(StudentController.createStudent));

// Get all students
// GET /api/v1/students
routerStudent.get("/", asyncHandler(StudentController.getAllStudents));

// Get students by parent ID
// GET /api/v1/students/parent/:parentId
routerStudent.get(
  "/parent/:parentId",
  asyncHandler(StudentController.getStudentsByParentId)
);

// Get students by grade
// GET /api/v1/students/grade/:grade
routerStudent.get(
  "/grade/:grade",
  asyncHandler(StudentController.getStudentsByGrade)
);

// Get student by ID (must be after specific routes)
// GET /api/v1/students/:id
routerStudent.get("/:id", asyncHandler(StudentController.getStudentById));

// Update student
// PUT /api/v1/students/:id
routerStudent.put("/:id", asyncHandler(StudentController.updateStudent));

// Delete student
// DELETE /api/v1/students/:id
routerStudent.delete("/:id", asyncHandler(StudentController.deleteStudent));

export default routerStudent;
