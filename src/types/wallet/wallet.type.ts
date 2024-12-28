import { Document, Types } from "mongoose";

interface IWallet extends Document {
  _id: string;
  user: Types.ObjectId;
  private_address: string;
  public_address: string;
}

export default IWallet;