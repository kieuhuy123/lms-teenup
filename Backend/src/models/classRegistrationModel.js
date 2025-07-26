import mongoose from "mongoose";

const classRegistrationSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required"],
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    registration_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations
classRegistrationSchema.index({ class_id: 1, student_id: 1 }, { unique: true });

// Index for better query performance
classRegistrationSchema.index({ class_id: 1 });
classRegistrationSchema.index({ student_id: 1 });
classRegistrationSchema.index({ status: 1 });

const classRegistrationModel = mongoose.model(
  "ClassRegistration",
  classRegistrationSchema
);

export default classRegistrationModel;
