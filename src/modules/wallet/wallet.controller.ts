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
    async sendOut(
        request: FastifyRequest<{
            Body: {
                sender_private_key: string;
                recipent_public_key: string;
                amount: number;
            };
        }>,
        reply: FastifyReply
    ) {
      try {
        const { sender_private_key, recipent_public_key, amount } = request.body
        const connection = new Connection(DEVNET_URL!, "confirmed");
        
        const privateKey = bs58.decode(sender_private_key);
        if (privateKey.length !== 64) {
            throw new Error("Invalid private key length");
        }
        const fromWallet = Keypair.fromSecretKey(privateKey);
      
        const recipientAddress = recipent_public_key
      
        const lamports = amount * LAMPORTS_PER_SOL;
      
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: new PublicKey(recipientAddress),
            lamports,
          })
        );
        const signature = await connection.sendTransaction(transaction, [fromWallet]);
        await connection.confirmTransaction(signature, "confirmed");
        
        return reply.code(200).send({
            status: 200,
            success: true,
            message: `Amount of SOL ${amount} has been sent`,
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

    async getBalanceWithTransactions(
        request: FastifyRequest<{
          Headers: {
            public_key: string
          }
        }>,
        reply: FastifyReply
    ) {
      try {
        const public_key = request.headers["public_key"];
        const connection = new Connection(DEVNET_URL, "confirmed");

        const publicKey = new PublicKey(public_key);

        const balanceLamports = await connection.getBalance(publicKey);
        const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

        const confirmedSignatures = await connection.getSignaturesForAddress(publicKey, {
            limit: 10,
        });

        return reply.code(200).send({
            status: 200,
            success: false,
            message: {
                balance: `${balanceSOL} SOL`,
                transactions: confirmedSignatures
            },
          });

    } catch (e) {
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