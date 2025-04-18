import mongoose, { Document, Schema, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;

export type taskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: taskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: taskStatus;
  }[];
  notes: Types.ObjectId[];
}

export const TaskSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: Types.ObjectId, ref: "Project" },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "Note",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

// Middlewares
TaskSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const taskId = this._id;
    if (!taskId) return;
    await Note.deleteMany({ task: taskId });
  }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
