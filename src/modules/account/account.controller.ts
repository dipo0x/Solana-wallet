import { FastifyReply, FastifyRequest } from 'fastify';
import WalletService from '../wallet/wallet.service';
import { ApiResponse } from '../../utils/apiResponse';
import logger from '../../utils/logger';

/**
 * @author Okpe Onoja Godwin
 * @description Account Settings
 * @route `/api/v1/account/settings`
 * @access Private
 * @type POST
 */
export async function 
    accountSettings(
      request: FastifyRequest,
      reply: FastifyReply
    ) {
  try {
    const user = request.user

    if(!user){  
        return reply
        .status(ApiResponse.RESOURCE_NOT_FOUND)
        .send(ApiResponse.success("User not found"));
    }

    const wallet = await WalletService.getWallet(user._id)

    return reply
      .status(ApiResponse.OK)
      .send(ApiResponse.success('User coins fetched.', { user, wallet }));

  } catch (e: any) {
    logger.error({ err: e }, "❌ Failed get account settings");
    return reply
      .status(ApiResponse.INTERNAL_SERVER_ERROR)
      .send(ApiResponse.error("Failed get account settings", e.message));
  }
}
