import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPackage",
      required: [true, "Package ID is required"],
    },
    start_date: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "End date is required"],
    },
    total_sessions: {
      type: Number,
      required: [true, "Total sessions is required"],
      min: [1, "Total sessions must be at least 1"],
    },
    used_sessions: {
      type: Number,
      default: 0,
      min: [0, "Used sessions cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
subscriptionSchema.index({ student_id: 1 });
subscriptionSchema.index({ package_id: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ start_date: 1, end_date: 1 });

// Virtual field to calculate remaining sessions
subscriptionSchema.virtual("remaining_sessions").get(function () {
  return this.total_sessions - this.used_sessions;
});

// Include virtuals when converting to JSON
subscriptionSchema.set("toJSON", { virtuals: true });

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);

export default subscriptionModel;
