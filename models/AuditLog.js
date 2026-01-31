const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  action: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  },

  prevHash: {
    type: String
  },

  hash: {
    type: String,
    required: true
  }
});

export default mongoose.model("AuditLog", auditLogSchema);