import AuditLog from "../models/AuditLog.js";

export const getMyLogs = async (req, res) => {
  const logs = await AuditLog.find({
    userId: req.user._id,
  }).sort({ timestamp: -1 });

  res.json(logs);
};

export const getAllLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("userId", "email role")
    .sort({ timestamp: -1 });

  res.json(logs);
};
