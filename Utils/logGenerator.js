import AuditLog from "../models/AuditLog.js";

const createLog = async (userId, action) => {
  await AuditLog.create({ userId, action });
};

export default createLog;
