import { calculateWalletWorth, getPriceInUSD } from '../../services/generic/blockchain.service';
import { Coin, Network } from '../wallet/models/wallet.coin.model';
import WalletService from '../wallet/wallet.service';
import {
  calculateSolanaBalance24HoursAgo,
  getTransactionDetailsWithAmount
} from '../../services/solana/solana.service';
import { solanaConnection } from '../../config/solana.config';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { calculatePnL } from '../../utils/coin.utils';
import ITransaction from '../../types/transaction/transaction.type';
import { INetwork } from '../../types/network/network.type';
import logger from '../../utils/logger';

export default class AssetService {

  static async getUserAssets(userId: string) {
    try {
      const wallet = await WalletService.getWallet(userId);
      if (!wallet) throw new Error('Wallet not found');

      const asset = await calculateWalletWorth(wallet._id);
      return asset;
    } catch (error: any) {
      logger.error({ err: error }, '❌ Failed to get user assets');
      throw new Error(error.message);
    }
  }

  static async getAssetDetails(user: any, coinId: string) {
    try {
      let balance = 0;
      let twenty4HoursBalance = 0;
      let transactions: ITransaction[] = [];

      const coin = await Coin.findOne({ walletId: user.walletId, _id: coinId })
        .populate({ path: 'networks', model: Network });

      if (!coin) throw new Error('Coin not found');

      switch (coin.symbol) {
        case 'SOL': {
          const networks = coin.networks as INetwork[];
          const connection = await solanaConnection();
          const publicKey = new PublicKey(networks[0]?.publicAddress);

          const balanceLamports = await connection.getBalance(publicKey);
          balance = balanceLamports / LAMPORTS_PER_SOL;

          twenty4HoursBalance = await calculateSolanaBalance24HoursAgo(networks[0]?.publicAddress);
          transactions = await getTransactionDetailsWithAmount(networks[0]?.publicAddress);
          break;
        }

        default:
          throw new Error('Unsupported coin type');
      }

      const assetValue = (await getPriceInUSD(coin.name)) * balance;
      const PnL = calculatePnL(balance, twenty4HoursBalance);

      return {
        name: coin.name,
        balance,
        assetValue,
        PnL,
        transactions
      };
    } catch (error: any) {
      logger.error({ err: error }, '❌ Failed to get asset details');
      throw new Error(error.message);
    }
  }
}
