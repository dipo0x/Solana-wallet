import { Coin } from '../modules/wallet/models/wallet.coin.model';
import { Network } from '../modules/wallet/models/wallet.coin.model';
import { Types } from 'mongoose';

interface CreateCoinAndNetworkInput {
    coinName: string;
    coinSymbol: string;
    walletId: string;
    networkName: string;
    privateAddress: string;
    publicAddress: string;
}

const createCoinAndNetwork = async ({
    coinName,
    coinSymbol,
    walletId,
    networkName,
    privateAddress,
    publicAddress,
}: CreateCoinAndNetworkInput) => {
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
        await coin.save();

        return { coin, network };
    } catch (error) {
        console.error('Error creating Coin and Network:', error);
        throw new Error('Failed to create Coin and Network');
    }
};
