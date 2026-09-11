import { Schema, model, Document, Types } from "mongoose";

/**
 * Real-time notifications/alerts (Admin feature: "নির্দিষ্ট ইভেন্টে
 * ইউজারদের কাছে রিয়েল-টাইম নোটিফিকেশন পাঠানো"). Persisted here so
 * a user can see notification history, and pushed live via Socket.io
 * when created.
 */
export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  meta: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "general", index: true }, // loan_status, investment_update, verification, system
    isRead: { type: Boolean, default: false, index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);
