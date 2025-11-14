import { FastifyRequest } from "fastify";
import { User } from "../modules/user/models/user.model";
import jwt from 'jsonwebtoken';
import logger from "../utils/logger";
import { ApiResponse } from "../utils/apiResponse";

export default async function authenticate(
  request: FastifyRequest<any>,
  reply: any
) {
  try {
    const authorization = request.headers.authorization;

    if(!authorization){  
        return reply
        .status(ApiResponse.BAD_REQUEST)
        .send(ApiResponse.error("No Authorization"));
    }

    if (!authorization.startsWith('Bearer ')) {
        return reply
        .status(ApiResponse.BAD_REQUEST)
        .send(ApiResponse.error("Invalid Authorization"));
    }

    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!) as any;

    if (!decodedToken || typeof decodedToken !== 'object' || !('_id' in decodedToken)) {
        return reply
        .status(ApiResponse.BAD_REQUEST)
        .send(ApiResponse.error("Invalid token payload"));
    }

    const user = await User.findById(decodedToken._id).exec();

    if (!user) {
        return reply
        .status(ApiResponse.UNAUTHORIZED)
        .send(ApiResponse.error("User not found"));
    }

    request.user = user;
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return reply
      .status(ApiResponse.UNAUTHORIZED)
      .send(ApiResponse.error("Invalid token"));
    }
    if (err.name === 'TokenExpiredError') {
      return reply
      .status(ApiResponse.UNAUTHORIZED)
      .send(ApiResponse.error("Authentication expired. Please login again."));
    }
    
    logger.error(err)
      return reply
        .status(ApiResponse.INTERNAL_SERVER_ERROR)
        .send(ApiResponse.error("Internal server error"));

  }
}