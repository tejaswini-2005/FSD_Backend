import { createHash } from "crypto";
import AuditLog, { findOne } from "../models/AuditLog";

const createAuditLog = async (userId, action) => {
  // Get last log
  const lastLog = await findOne().sort({ timestamp: -1 });

  const prevHash = lastLog ? lastLog.hash : "GENESIS";

  const data = `${userId}${action}${Date.now()}${prevHash}`;

  const hash = createHash("sha256")
    .update(data)
    .digest("hex");

  const log = new AuditLog({
    userId,
    action,
    prevHash,
    hash
  });

  await log.save();
};

export default createAuditLog;
