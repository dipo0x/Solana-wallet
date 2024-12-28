import { Schema, model, Types } from 'mongoose';
import { INetwork } from '../../../types/network/network.type';
import { ICoin } from '../../../types/coin/coin.type';

const networkSchema = new Schema<INetwork>({
    name: { type: String, required: true },
    privateAddress: {  type: String, required: true },
    publicAddress: { type: String, required: true },
    coinId: { type: Schema.Types.ObjectId, required: true},
});

const Network = model<INetwork>('Network', networkSchema);

const coinSchema = new Schema<ICoin>({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    walletId: { type: Schema.Types.ObjectId, required: true},
    networks: [{ type: Schema.Types.ObjectId, ref: 'Network' }],
});

const Coin = model<ICoin>('Coin', coinSchema);

export { Coin, Network  };
