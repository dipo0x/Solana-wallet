import { Document, Types } from "mongoose";
import IWallet from "../wallet/wallet.type";

interface IUser extends Document {
  _id: string;
  username: string;
  profile_picture: string;
  securityId: Types.ObjectId;
  walletId: IWallet['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;