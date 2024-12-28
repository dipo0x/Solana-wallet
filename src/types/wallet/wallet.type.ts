import mongoose, { Document, Types } from "mongoose";
import { ICoin } from "../coin/coin.type";

interface IWallet extends Document {
    user: mongoose.Types.ObjectId
    coins: ICoin['_id'][];
}

export default IWallet;