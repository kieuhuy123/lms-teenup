import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import ParentController from "../controllers/parentController.js";

const routerParent = Router();

// Create a new parent
// POST /api/v1/parents
routerParent.post("/", asyncHandler(ParentController.createParent));

// Get all parents
// GET /api/v1/parents
routerParent.get("/", asyncHandler(ParentController.getAllParents));

// Get parent by ID
// GET /api/v1/parents/:id
routerParent.get("/:id", asyncHandler(ParentController.getParentById));

// Update parent
// PUT /api/v1/parents/:id
routerParent.put("/:id", asyncHandler(ParentController.updateParent));

// Delete parent
// DELETE /api/v1/parents/:id
routerParent.delete("/:id", asyncHandler(ParentController.deleteParent));

export default routerParent;
