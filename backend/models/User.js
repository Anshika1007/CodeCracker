import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    additionalEmail: { type: String, default: "" },
    profileImage: { type: String, default: "" }, 
    platforms: {
      codechef: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      gfg: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
