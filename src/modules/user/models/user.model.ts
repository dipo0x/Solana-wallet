import { Schema, Types, model } from "mongoose";
import IUserDocument from "../../../types/user/user.type";

const userSchema = new Schema(
  {
    securityId: {
      type: Types.ObjectId,
      ref: "UserSecurity",
    },
    username: {
      type: String,
      required: true,
    },
},
  {
    timestamps: true
  }
);
export const User = model<IUserDocument>(
  "User",
  userSchema
);