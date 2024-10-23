import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;


const adminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});


const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});


const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  creatorId: { type: ObjectId, ref: "Admin", required: true }, 
});

const purchaseSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true }, 
  courseId: { type: ObjectId, ref: "Course", required: true }, 
  signature: { type: String, required: true, unique: true },
  purchasedAt: { type: Date, default: Date.now }, 
});


const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Courses = mongoose.model("Course", courseSchema);
const Purchases = mongoose.model("Purchase", purchaseSchema);


export { User, Admin, Courses, Purchases };
