import { FastifyReply, FastifyRequest } from 'fastify';
import {
    Connection,
    PublicKey,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
  } from "@solana/web3.js";
import dotenv from 'dotenv';
import bs58 from 'bs58';
dotenv.config();

const DEVNET_URL = process.env.QUICKNODE_RPC_URL!

const wallet = {
    async createWallet(
        request: FastifyRequest<{
            Body: {
                account_name: string;
            };
        }>,
        reply: FastifyReply
    ) {
      try {
        const { account_name } = request.body
        const connection = new Connection(DEVNET_URL!, "confirmed");
        
        const wallet = Keypair.generate();

        const publicAddress = wallet.publicKey.toString()
        const privateAddress = Buffer.from(wallet.secretKey).toString("base64")
        
        return reply.code(200).send({
            status: 200,
            success: true,
            message: `Account created successfully`,
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

    
}

export default wallet