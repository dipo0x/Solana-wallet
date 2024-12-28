import { Schema, Types, model } from "mongoose";
import IWalletDocument from "../../../types/wallet/wallet.type";

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
    private_address: {
        type: String,
        required: true
    },
    public_address: {
        type: String,
        required: true
    }
},
  {
    timestamps: true
  }
);
export const User = model<IWalletDocument>(
  "Wallet",
  userSchema
);