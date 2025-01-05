import mongoose, { Document, Types } from "mongoose";
import { ICoin } from "../coin/coin.type";

interface IWallet extends Document {
    _id: Types.ObjectId;
    user: mongoose.Types.ObjectId
     coins: (ICoin | Types.ObjectId | unknown )[];
}

export default IWallet;