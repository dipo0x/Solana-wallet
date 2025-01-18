import { FastifyReply, FastifyRequest } from 'fastify';
import { calculateWalletWorth, getPriceInUSD } from '../../services/generic/blockchain.service';
import { Coin, Network } from '../wallet/models/wallet.coin.model';
import Wallet from '../wallet/models/wallet.model';
import {
    calculateSolanaBalance24HoursAgo,
    getTransactionDetailsWithAmount
} from '../../services/solana/solana.service';
import { INetwork } from '../../types/network/network.type';
import { solanaConnection } from '../../config/solana.config';
import {
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { calculatePnL } from '../../utils/coin.utils';
import ITransaction from '../../types/transaction/transaction.type';

const asset = {
    async getAssets(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
      try {
        const user = request.user
        if(!user){
            return reply.code(404).send({
                status: 404,
                success: false,
                message: "User not found",
            });
        }
        const wallet = await Wallet.findOne({ user: user._id })
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
        const asset = await calculateWalletWorth(wallet!._id)
        return reply.status(200).send({
            success: true,
            message: 'User asset fetched.',
            asset
        });
    }
    catch (e) {
        console.log(e)
        return reply.code(500).send({
            status: 500,
            success: false,
            message: e,
        });
      }
    },
    async getAssetsDetails(
        request: FastifyRequest<{
            Params: {
                id: string
            }
        }>,
        reply: FastifyReply
    ) {
      try {
        const user = request.user
        if(!user){
            return reply.status(400).send({
                success: false,
                message: 'You are not allowed to access this'
            });
        }
        
        let balance: number = 0
        let twenty4HoursBalance = 0
        let transactions: ITransaction[] = []
        const coin = await Coin.findOne( { walletId: user.walletId, _id: request.params.id})
            .populate({
                path: 'networks',
                model: Network
        })

        if(!coin){
            return reply.status(404).send({
                success: false,
                message: 'Coin not found'
            });
        }

        switch (coin.symbol) {
            case "SOL":
                const networks = coin.networks as INetwork[];
                const connection = await solanaConnection()
                const publicKey = new PublicKey(networks[0]?.publicAddress);
                const balanceLamports = await connection.getBalance(publicKey);
                balance = balanceLamports / LAMPORTS_PER_SOL;
              
                twenty4HoursBalance = await calculateSolanaBalance24HoursAgo(
                    networks[0]?.publicAddress
                );
                transactions = await getTransactionDetailsWithAmount(networks[0]?.publicAddress);
            break;
        }

        return reply.status(200).send({
            success: true,
            message: 'User asset fetched.',
            data: {
                name: coin.name,
                balance,
                assetValue: await getPriceInUSD(coin.name) * balance,
                PnL: calculatePnL(balance, twenty4HoursBalance),
                transactions
            }
        });
    }
    catch (e) {
        console.log(e)
        return reply.code(500).send({
            status: 500,
            success: false,
            message: e,
        });
      }
    }
}

export default asset