import { Document, Types } from "mongoose";

interface IUserSecurity extends Document {
  _id: string;
  userId: Types.ObjectId;
  private_key: string;
  recoveryPhraseHash: string;
  recoveryWordHashes: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export default IUserSecurity;