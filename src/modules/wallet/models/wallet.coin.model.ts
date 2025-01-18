import { model, Schema } from 'mongoose';
import { encryptData } from '../../../services/google/encryption.service';
import { ICoin } from '../../../types/coin/coin.type';
import { INetwork } from '../../../types/network/network.type';

const networkSchema = new Schema<INetwork>({
    name: { type: String, required: true },
    privateAddress: {  type: String, required: true },
    publicAddress: { type: String, required: true },
    coinId: { type: Schema.Types.ObjectId, required: false },
});

networkSchema.pre('save', async function (next) {
    const network = this as INetwork;

    if (!network.isModified('privateAddress')) {
        return next();
    }
    try {
        network.privateAddress = await encryptData(network.privateAddress) as string
        next();
    } catch (err) {
        console.log(err)
    }
});

const Network = model<INetwork>('Network', networkSchema);

const coinSchema = new Schema<ICoin>({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    walletId: { type: Schema.Types.ObjectId, required: false },
    networks: [{ type: Schema.Types.ObjectId, ref: 'Network' }],
});

const Coin = model<ICoin>('Coin', coinSchema);

export { Coin, Network };

