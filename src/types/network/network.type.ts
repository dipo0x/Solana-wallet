import { Document, Types } from "mongoose";

export interface INetwork extends Document {
    _id: Types.ObjectId;
    name: string;
    coinId: Types.ObjectId;
    privateAddress: string;
    publicAddress: string;
}