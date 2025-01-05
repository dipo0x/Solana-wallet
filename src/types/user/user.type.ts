import { Document, Types } from "mongoose";
import IWallet from "../wallet/wallet.type";

interface IUser extends Document {
  _id: string;
  username: string;
  profile_picture: string;
  securityId: Types.ObjectId;
  wallets: IWallet['_id'][];
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;