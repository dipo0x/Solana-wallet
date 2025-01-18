import { Schema, Types, model } from "mongoose";
import IUserSecurity from "../../../types/user/user.security.type";

const userSecuritySchema = new Schema <IUserSecurity> (
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recoveryPhraseHash: {
      type: String,
      required: true
    },
    recoveryWordHashes: {
      type: Map, of: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
export const Security = model<IUserSecurity>(
  "UserSecurity",
  userSecuritySchema
);