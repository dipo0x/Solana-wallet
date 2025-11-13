import { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import { signToken } from "../../utils/jwt";
import WalletService from "./user.service";
import logger from "../../utils/logger";
import { ApiResponse } from "../../utils/apiResponse";

dotenv.config();

export async function 
   createWallet(
    request: FastifyRequest<{ Body: { wallet_name: string } }>,
    reply: FastifyReply
  ) {
  try {
    const { wallet_name } = request.body;
    
      if(!wallet_name){  
          return reply
          .status(ApiResponse.BAD_REQUEST)
          .send(ApiResponse.error("Wallet name is required"));
      }

    const { user, recoveryPhrase } = await WalletService.createWallet(wallet_name);

    return reply
      .status(ApiResponse.OK)
      .send(ApiResponse.success(`Account created successfully. Here is your recovery phrase: ${recoveryPhrase}`, user));

  } catch (e: any) {
    logger.error({ err: e }, "❌ Failed to create wallet");
    return reply
      .status(ApiResponse.INTERNAL_SERVER_ERROR)
      .send(ApiResponse.error("Failed to create wallet", e.message));
  }
}

export async function 
   loginWallet(
    request: FastifyRequest<{ Body: { key_phrases: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { key_phrases } = request.body;

      if(!key_phrases){  
          return reply
          .status(ApiResponse.BAD_REQUEST)
          .send(ApiResponse.error("Key phrases are required"));
      }

      const user = await WalletService.loginWallet(key_phrases);
      
        if(!user){  
            return reply
            .status(ApiResponse.BAD_REQUEST)
            .send(ApiResponse.success("Incorrect key phrases."));
        }


      const token = await signToken(user);

      return reply
        .status(ApiResponse.OK)
        .send(ApiResponse.success('User validated successfully', { user, token }));

    } catch (e: any) {
      logger.error({ err: e }, "❌ Failed login wallet");
      return reply
        .status(ApiResponse.INTERNAL_SERVER_ERROR)
        .send(ApiResponse.error("Failed login wallet", e.message));
    }
}

