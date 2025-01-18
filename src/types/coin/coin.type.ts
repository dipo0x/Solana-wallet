import { Document, Types } from "mongoose";
import { INetwork } from "../network/network.type";

export interface ICoin extends Document {
    _id: Types.ObjectId;
    name: string;
    symbol: string;
    walletId: Types.ObjectId
    networks: INetwork['_id'][] | INetwork[]
}