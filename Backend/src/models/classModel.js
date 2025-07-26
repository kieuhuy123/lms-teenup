import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    day_of_week: {
      type: String,
      required: [true, "Day of week is required"],
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    time_slot: {
      start_time: {
        type: String,
        required: [true, "Start time is required"],
        // Format: "HH:MM" (e.g., "09:00")
      },
      end_time: {
        type: String,
        required: [true, "End time is required"],
        // Format: "HH:MM" (e.g., "10:30")
      },
    },
    teacher_name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    max_students: {
      type: Number,
      required: [true, "Maximum students is required"],
      min: [1, "Maximum students must be at least 1"],
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
classSchema.index({ day_of_week: 1 });
classSchema.index({ subject: 1 });
classSchema.index({
  day_of_week: 1,
  "time_slot.start_time": 1,
  "time_slot.end_time": 1,
});

const classModel = mongoose.model("Class", classSchema);

export default classModel;
