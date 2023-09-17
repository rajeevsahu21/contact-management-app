import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must be 3 characters or more"],
    },
    user_name: {
      type: String,
      required: [true, "User Name is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      max: 100,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
