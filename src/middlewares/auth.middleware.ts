import { FastifyRequest } from "fastify";
import { User } from "../modules/user/models/user.model";
import jwt from 'jsonwebtoken';

export default async function authenticate(
  request: FastifyRequest<any>,
  reply: any
) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return reply.code(400).send({
        status: 400,
        success: false,
        message: 'No Authorization',
      });
    }

    if (!authorization.startsWith('Bearer ')) {
      return reply.code(400).send({
        status: 400,
        success: false,
        message: 'Invalid Authorization',
      });
    }

    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!) as any;

    if (!decodedToken || typeof decodedToken !== 'object' || !('_id' in decodedToken)) {
      return reply.code(400).send({
        status: 400,
        success: false,
        message: 'Invalid token payload',
      });
    }

    const user = await User.findById(decodedToken._id).exec();

    if (!user) {
      return reply.code(401).send({
        status: 401,
        success: false,
        message: 'User not found',
      });
    }

    request.user = user;
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return reply.code(401).send({
        status: 401,
        success: false,
        message: 'Invalid token',
      });
    }
    if (err.name === 'TokenExpiredError') {
      return reply.code(401).send({
        status: 401,
        success: false,
        message: 'Authentication expired. Please login again.',
      });
    }
    
    console.log(err)
    return reply.code(500).send({
      status: 500,
      success: false,
      message: 'Internal server error',
    });
  }
}