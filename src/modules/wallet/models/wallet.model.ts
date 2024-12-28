import { Schema, model } from 'mongoose';
import IWallet from "../../../types/wallet/wallet.type";

const walletSchema = new Schema<IWallet>({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coins: [{
      type: Schema.Types.ObjectId,
      ref: 'Coin'
    }],
});

const Wallet = model<IWallet>('Wallet', walletSchema);

export default Wallet;