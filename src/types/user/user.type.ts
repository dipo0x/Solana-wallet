import { Document, Types } from "mongoose";
import IWallet from "../wallet/wallet.type";

interface IUser extends Document {
  _id: string;
  username: string;
  securityId: Types.ObjectId;
  wallets: IWallet['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;