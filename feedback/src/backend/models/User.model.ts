import mongoose, { Schema, Document } from "mongoose";
import { ContentSchema, message } from "./Content.model";
export interface user extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isverified: boolean;
  isAcceptingMessages: boolean;
  messages: message[];
}

export const UserSchema: Schema<user> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required"],
  },
  isverified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
    default: true,
  },
  messages: [ContentSchema],
});
const UserModel =
  (mongoose.models.user as mongoose.Model<user>) ||
  mongoose.model<user>("User", UserSchema);
export default UserModel;
