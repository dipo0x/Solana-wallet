import { FastifyReply, FastifyRequest } from 'fastify';
import { Keypair } from "@solana/web3.js";
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Security } from './models/user.security.model';
import { encrypt } from '../../utils/encryption';
import { generateRecoveryPhrase, hashRecoveryPhrase, hashWords } from '../../utils/generate';
import { encryptData } from '../../services/encryptionService';
import Wallet from '../wallet/models/wallet.model';
import { Coin, Network } from '../wallet/models/wallet.coin.model';
import mongoose from 'mongoose';

dotenv.config();

const wallet = {
    async createWallet(
        request: FastifyRequest<{
            Body: {
                wallet_name: string;
            };
        }>,
        reply: FastifyReply
    ) {
      try {
        const wallet_name = request.body.wallet_name
        if(!request.body.wallet_name){
            return reply.code(400).send({
                status: 400,
                success: true,
                message: "Wallet name is required",
            });
        }
        
        const wallet = Keypair.generate();

        const publicAddress = wallet.publicKey.toString()
        const privateAddress = Buffer.from(wallet.secretKey).toString("base64")

        const user = await User.create({
            username: wallet_name
        })

        const hashedPrivateKey = await encryptData(privateAddress)

        let recoveryPhrase = '';
        let recoveryPhraseHash = '';
        let recoveryWordHashes;
        let isDuplicate = true;

        while (isDuplicate) {
            recoveryPhrase = generateRecoveryPhrase();
            recoveryPhraseHash = await hashRecoveryPhrase(recoveryPhrase);
            recoveryWordHashes = hashWords(recoveryPhrase);
            isDuplicate = await isDuplicateRecoveryPhrase(recoveryWordHashes);
        }

        const userSecurity = await Security.create({
            userId: user._id,
            private_key: hashedPrivateKey,
            recoveryPhraseHash: recoveryPhraseHash,
            recoveryWordHashes: recoveryWordHashes
        })

        await User.findOneAndUpdate(
            {
                _id: user._id
            },
            {
                securityId: userSecurity._id
            }
        )

        const network = await Network.create({
            name: 'Solana',
            privateAddress: hashedPrivateKey,
            publicAddress,
            coinId: null,
        });

        const coin = await Coin.create({
            name: 'Solana',
            symbol: 'SOL',
            walletId: null,
            networks: [network._id],
        });

        network.coinId = coin._id as mongoose.Types.ObjectId;
        await network.save();

        const userWallet = await Wallet.create({
            user: user._id,
            coins: [coin._id],
        });

        coin.walletId = userWallet._id as mongoose.Types.ObjectId;
        await coin.save();

        return reply.code(200).send({
            status: 200,
            success: true,
            message: `Account created successfully. Here is your recovery phrase: ${recoveryPhrase}`,
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

async function isDuplicateRecoveryPhrase(hashIdentifier: Record<number, string>): Promise<boolean> {
    const existing = await Security.findOne({
        where: { recoveryWordHashes: hashIdentifier },
    });
    return !!existing;
}

export default wallet