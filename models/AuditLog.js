import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  action: String,

  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

auditSchema.pre("deleteOne", () => {
  throw new Error("Cannot delete logs");
});

export default mongoose.model("AuditLog", auditSchema);
