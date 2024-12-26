import { Schema, Types, model } from "mongoose";
import IUserSecurity from "../../../types/user/user.type";

const userSecuritySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    private_key: {
      type: String,
      required: true,
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