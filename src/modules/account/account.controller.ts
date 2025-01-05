import { FastifyReply, FastifyRequest } from 'fastify';
import Wallet from '../wallet/models/wallet.model';
import { Coin, Network } from '../wallet/models/wallet.coin.model';
import { calculateWalletWorth } from '../../services/blockchain.service';

const account = {
    async accountSettings(
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
        return reply.status(200).send({
            success: true,
            message: 'User coins fetched.',
            user,
            wallet
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
    }
}

export default account