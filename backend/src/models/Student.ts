import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStudent extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  classId: Types.ObjectId;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  admissionDate: Date;
}

const studentSchema = new Schema<IStudent>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  rollNumber: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
});

export const Student = mongoose.model<IStudent>("Student", studentSchema);