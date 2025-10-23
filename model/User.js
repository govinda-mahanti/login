import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    resetToken: String,
    resetTknExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
