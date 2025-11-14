import IWallet from "../../types/wallet/wallet.type";
import Wallet from "../wallet/models/wallet.model";
import { Coin, Network } from '../wallet/models/wallet.coin.model';
import { ICoin } from "../../types/coin/coin.type";

export default class WalletService {

    static async getWallet(userId: string): Promise<IWallet | null>{
        const wallet = await Wallet.findOne({ user: userId })
            .populate({
                path: 'coins',
                model: Coin,
                populate: {
                    path: 'networks',
                    model: Network,
                    select: '-privateAddress',
                },
            })
            .lean()
            .exec();

        return wallet
    }

    static async getCoin(wallet: string, id: string): Promise<ICoin | null>{
        const data = await Coin.findOne( { walletId: wallet, _id: id})
            .populate({
                path: 'networks',
                model: Network
        })

        return data
    }
}