import User from "../models/userModel.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";

export const inviteUser = async (req, res) => {
  const { name, email, role } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    role,
    verifyToken: token,
  });

  const link = `http://localhost:8080/api/v1/auth/verify-link/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Activate Account",
    text: `Click to activate: ${link}`,
  });

  res.json({ msg: "Invite sent" });
};

