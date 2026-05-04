export interface ModalStudent {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  phone?: string;
  classId?: any;
  dob?: string;
  status: "active" | "inactive" | "on-leave" | "new";
}

export const EMPTY_STUDENT: ModalStudent = {
  name: "",
  email: "",
  password: "password123",
  rollNumber: "",
  parentName: "",
  parentPhone: "",
  phone: "",
  classId: "",
  dob: "",
  status: "active"
};
