import { Schema, Types, model } from "mongoose";
import IUserDocument from "../../../types/user/user.type";

const userSchema = new Schema <IUserDocument> (
  {
    securityId: {
      type: Schema.Types.ObjectId,
      ref: "UserSecurity",
    },
    username: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      required: false,
      default: ""
    },
    wallets: [{
      type: Schema.Types.ObjectId,
      ref: 'Wallet'
    }],
},
  {
    timestamps: true
  }
);
export const User = model<IUserDocument>(
  "User",
  userSchema
);