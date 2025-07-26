import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    current_grade: {
      type: String,
      required: [true, "Current grade is required"],
      trim: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: [true, "Parent ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
studentSchema.index({ parent_id: 1 });
studentSchema.index({ current_grade: 1 });

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
