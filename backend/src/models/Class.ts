import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClass extends Document {
  _id: Types.ObjectId;
  grade: number;
  section: string;
  classTeacherId: Types.ObjectId;
  studentCount: number;
  room?: string;
  capacity?: number;
}

const classSchema = new Schema<IClass>({
  grade: { type: Number, required: true },
  section: { type: String, required: true },
  classTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
  studentCount: { type: Number, default: 0 },
  room: { type: String },
  capacity: { type: Number },
});

classSchema.virtual("subjects", {
  ref: "Subject",
  localField: "_id",
  foreignField: "classId",
});

classSchema.set("toObject", { virtuals: true });
classSchema.set("toJSON", { virtuals: true });

export const Class = mongoose.model<IClass>("Class", classSchema);