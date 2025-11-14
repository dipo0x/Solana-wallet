import fastify from 'fastify';
import dotenv from 'dotenv';
import { appRoutes } from './routes/app.route';
import connectDB from './config/database.config';
import logger from './utils/logger';
dotenv.config();

export const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

const uuidv4 = require('uuid').v4;
export const server = fastify({
  logger: true,
  genReqId(req) {
    return uuidv4();
  },
});

server.get('/healthcheck', async function () {
  return { status: 'Ok' };
});

server.register(async (instance) => {
  appRoutes.forEach((route) => {
    instance.register(route.router, { prefix: route.path });
  });
}, { prefix: '/api/v1' });


// Error Handler
server.setErrorHandler(async (err, request, reply) => {
  reply.code(500).send({
    status: 500,
    success: false,
    message: 'Something went wrong',
  });
});

// Not found handler
server.setNotFoundHandler(async (request, reply) => {
  reply.code(404).send({
    status: 404,
    success: false,
    message: `You shouldn't be here bro!`,
  });
});


(async function main() {
  try {
    await server.listen({ host, port });
    await connectDB();
    logger.info('Server ready on port', port);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
})();