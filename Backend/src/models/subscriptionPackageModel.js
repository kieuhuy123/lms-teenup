import mongoose from "mongoose";

const subscriptionPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    total_sessions: {
      type: Number,
      required: [true, "Total sessions is required"],
      min: [1, "Total sessions must be at least 1"],
    },
    duration_days: {
      type: Number,
      required: [true, "Duration in days is required"],
      min: [1, "Duration must be at least 1 day"],
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
subscriptionPackageSchema.index({ status: 1 });
subscriptionPackageSchema.index({ name: 1 });

const subscriptionPackageModel = mongoose.model(
  "SubscriptionPackage",
  subscriptionPackageSchema
);

export default subscriptionPackageModel;
