import AuditLog from "../models/AuditLog.js";

export const getMyLogs = async (req, res) => {
  const logs = await AuditLog.find({
    userId: req.user._id,
  }).sort({ timestamp: -1 });

  res.json(logs);
};

export const getAllLogs = async (req, res) => {
  const { user, action, from, to } = req.query;
  let query = {};

  // 1. Filter by User
  if (user) query.userId = user;

  // 2. Filter by Action
  if (action) query.action = action;

  // 3. Filter by Date Range
  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);
  }

  const logs = await AuditLog.find(query)
    .populate("userId", "email role")
    .sort({ timestamp: -1 });

  res.json(logs);
};