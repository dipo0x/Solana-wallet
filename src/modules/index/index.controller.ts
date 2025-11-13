import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../../utils/logger';
import { ApiResponse } from '../../utils/apiResponse';

export async function 
     index(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
    try {
        return reply
            .status(ApiResponse.OK)
            .send(ApiResponse.success('Springten API is up and running'));

    } catch (e: any) {
    logger.error({ err: e }, "❌ Internal server error");
    return reply
        .status(ApiResponse.INTERNAL_SERVER_ERROR)
        .send(ApiResponse.error("Internal server error", e.message));
    }

}

