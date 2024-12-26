import { Document, Types } from "mongoose";

interface IUser extends Document {
  _id: string;
  username: string;
  securityId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;