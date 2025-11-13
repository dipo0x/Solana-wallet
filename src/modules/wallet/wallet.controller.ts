import { FastifyReply, FastifyRequest } from "fastify";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import dotenv from "dotenv";
import bs58 from "bs58";
import { solanaConnection } from "../../config/solana.config";
import logger from "../../utils/logger";
import { ApiResponse } from "../../utils/apiResponse";

dotenv.config();

/**
 * @author Okpe Onoja Godwin
 * @description SEND SOL TRANSACTION
 * @route `/api/v1/wallet/send-sol`
 * @access Private
 * @type POST
 */
export async function 
   sendOut(
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
        const connection = await solanaConnection()

      const privateKey = bs58.decode(sender_private_key);
      if (privateKey.length !== 64) {
        throw new Error("Invalid private key length");
      }

      const fromWallet = Keypair.fromSecretKey(privateKey);
      const recipientAddress = new PublicKey(recipent_public_key);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: recipientAddress,
          lamports,
        })
      );

      const signature = await connection.sendTransaction(transaction, [fromWallet]);
      await connection.confirmTransaction(signature, "confirmed");

      logger.info(
        `✅ Sent ${amount} SOL from ${fromWallet.publicKey.toString()} to ${recipientAddress.toString()}`
      );

      return reply
        .status(ApiResponse.OK)
        .send(ApiResponse.success(`Sent ${amount} SOL successfully`, { signature }));

    } catch (e: any) {
      logger.error({ err: e }, "❌ Failed to send SOL transaction");
      return reply
        .status(ApiResponse.INTERNAL_SERVER_ERROR)
        .send(ApiResponse.error("Failed to send SOL transaction", e.message));
    }
}

/**
 * @author Okpe Onoja Godwin
 * @description GET BALANCE + TRANSACTIONS
 * @route `/api/v1/wallet/settings`
 * @access Private
 * @type GET
 */
export async function  
  getBalanceWithTransactions(
    request: FastifyRequest<{
          Headers: {
            public_key: string
          }
    }>,
    reply: FastifyReply
  ) {
    try {
      const public_key = request.headers["public_key"];
      if (!public_key) {
        return reply
          .status(ApiResponse.BAD_REQUEST)
          .send(ApiResponse.error("Public key is required"));
      }

      const connection = await solanaConnection();
      const publicKey = new PublicKey(public_key);

      const balanceLamports = await connection.getBalance(publicKey);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

      const confirmedSignatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      });

      logger.info(`📊 Fetched balance and transactions for ${public_key}`);

      return reply
        .status(ApiResponse.OK)
        .send(
          ApiResponse.success("Wallet details fetched successfully", {
            balance: `${balanceSOL} SOL`,
            transactions: confirmedSignatures,
          })
        );
    } catch (e: any) {
      logger.error({ err: e }, "❌ Failed to fetch wallet details");
      return reply
        .status(ApiResponse.INTERNAL_SERVER_ERROR)
        .send(ApiResponse.error("Failed to fetch wallet details", e.message));
    }
  
}