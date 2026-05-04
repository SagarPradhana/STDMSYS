import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITeacher extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  employeeId: string;
  subjects: Types.ObjectId[];
  classes: Types.ObjectId[];
  qualification: string;
  joiningDate: Date;
}

const teacherSchema = new Schema<ITeacher>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  qualification: { type: String },
  joiningDate: { type: Date, default: Date.now },
});

export const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);