import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse } from '../../utils/apiResponse';
import logger from '../../utils/logger';
import AssetService from './asset.service';

/**
 * @author Oladipo Adesiyan
 * @description Fetch all user assets with their total worth and portfolio summary.
 * @route `/api/v1/asset/assets`
 * @access Private
 * @type GET
 */
export async function 
    getAssets(
      request: FastifyRequest,
      reply: FastifyReply
    ) {
  try {
    const user = request.user;

    if (!user) {
      return reply
        .status(ApiResponse.RESOURCE_NOT_FOUND)
        .send(ApiResponse.error('User not found'));
    }

    const assets = await AssetService.getUserAssets(user._id);

    return reply
      .status(ApiResponse.OK)
      .send(ApiResponse.success('User asset fetched successfully', assets));
  } catch (e: any) {
    logger.error({ err: e }, '❌ Failed to get user asset');
    return reply
      .status(ApiResponse.INTERNAL_SERVER_ERROR)
      .send(ApiResponse.error('Failed to get user asset', e.message));
  }
}

/**
 * @author Oladipo Adesiyan
 * @descriptionFetch detailed info for a specific user asset, including balance, value, PnL, and transactions.
 * @route `/api/v1/asset/details/:id`
 * @access Private
 * @type GET
 */
export async function
    getAssetsDetails(
      request: FastifyRequest<{
        Params: 
         {
           id: string 
          } 
      }>,
      reply: FastifyReply
  ) {
  try {
    const user = request.user;

    if (!user) {
      return reply
        .status(ApiResponse.BAD_REQUEST)
        .send(ApiResponse.error('User not allowed'));
    }

    const details = await AssetService.getAssetDetails(user, request.params.id);

    return reply
      .status(ApiResponse.OK)
      .send(ApiResponse.success('User asset fetched successfully', details));
  } catch (e: any) {
    logger.error({ err: e }, '❌ Failed to get asset details');
    return reply
      .status(ApiResponse.INTERNAL_SERVER_ERROR)
      .send(ApiResponse.error('Failed to get asset details', e.message));
  }
}
