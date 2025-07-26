import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
parentSchema.index({ email: 1 });
parentSchema.index({ phone: 1 });

const parentModel = mongoose.model("Parent", parentSchema);

export default parentModel;
