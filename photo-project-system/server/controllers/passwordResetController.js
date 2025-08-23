import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import Photographer from "../models/Photographer.js";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/sendEmail.js";

// helper: pick model
const getUserModel = (userType) => {
  switch (userType) {
    case "user": return User;
    case "photographer": return Photographer;
    case "admin": return Admin;
    default: throw new Error("Invalid user type");
  }
};

/* ------------------ STEP 1: Forgot Password ------------------ */
export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, userType } = req.body;
    const UserModel = getUserModel(userType);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // clear any old
    await PasswordReset.deleteMany({ email, userType });

    await PasswordReset.create({ email, otp, userType, expiresAt });

    await sendEmail(
      email,
      "Password Reset OTP",
      `
        <h2>Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>Your OTP is:</p>
        <h3>${otp}</h3>
        <p>Valid for 5 minutes.</p>
      `
    );

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ------------------ STEP 2: Reset Password (with OTP) ------------------ */
export const resetPassword = async (req, res) => {
  try {
    const { email, userType, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // check otp
    const record = await PasswordReset.findOne({ email, userType, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const UserModel = getUserModel(userType);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // update pass
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // delete OTP record
    await PasswordReset.deleteMany({ email, userType });

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
