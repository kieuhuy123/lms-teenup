import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import ClassController from "../controllers/classController.js";

const routerClass = Router();

// Create a new class
// POST /api/v1/classes
routerClass.post("/", asyncHandler(ClassController.createClass));

// Get classes (all or by day)
// GET /api/v1/classes?day=monday
// GET /api/v1/classes
routerClass.get("/", asyncHandler(ClassController.getClasses));

// Register student to class
// POST /api/v1/classes/:id/register
routerClass.post(
  "/:id/register",
  asyncHandler(ClassController.registerStudentToClass)
);

// Get students registered for a class
// GET /api/v1/classes/:id/students
routerClass.get(
  "/:id/students",
  asyncHandler(ClassController.getClassStudents)
);

// Get class by ID (must be after specific routes)
// GET /api/v1/classes/:id
routerClass.get("/:id", asyncHandler(ClassController.getClassById));

// Update class
// PUT /api/v1/classes/:id
routerClass.put("/:id", asyncHandler(ClassController.updateClass));

// Delete class
// DELETE /api/v1/classes/:id
routerClass.delete("/:id", asyncHandler(ClassController.deleteClass));

export default routerClass;
