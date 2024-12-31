import { Coin } from '../modules/wallet/models/wallet.coin.model';
import { Network } from '../modules/wallet/models/wallet.coin.model';
import { Types } from 'mongoose';
import Wallet from '../modules/wallet/models/wallet.model';

export const createCoinAndNetwork = async (
    coinName: string,
    coinSymbol: string,
    walletId: Types.ObjectId,
    networkName: string,
    privateAddress: string,
    publicAddress: string,
) => {
    try {
        if (!Types.ObjectId.isValid(walletId)) {
            throw new Error('Invalid walletId provided');
        }

        const coin = await Coin.create({
            name: coinName,
            symbol: coinSymbol,
            walletId: new Types.ObjectId(walletId),
        });

        const network = await Network.create({
            name: networkName,
            privateAddress,
            publicAddress,
            coinId: coin._id,
        });

        coin.networks.push(network._id);
        
        const wallet = await Wallet.findById(walletId);
        wallet?.coins.push(coin._id)
        await coin.save();

        return { coin, network };
    } catch (error) {
        console.error('Error creating Coin and Network:', error);
        throw new Error('Failed to create Coin and Network');
    }
};
