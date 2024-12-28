import { Document, Types } from "mongoose";
import { INetwork } from "../network/network.type";

export interface ICoin extends Document {
    name: string;
    symbol: string;
    walletId: Types.ObjectId
    networks: INetwork['_id'][];
}